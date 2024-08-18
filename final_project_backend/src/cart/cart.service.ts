import {
  BadRequestException,
  ConsoleLogger,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { User } from 'src/user/entities/user.entity';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart.item.entity';
import { DataSource, getConnection, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Merchandise } from 'src/merchandise/entities/merchandise.entity';
import { MerchandiseOption } from 'src/merchandise/entities/marchandise-option.entity';
import { stat } from 'fs';
import { query } from 'express';
import { HttpRequest } from 'aws-sdk';
import { catchError } from 'rxjs';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,
    @InjectRepository(Merchandise)
    private readonly merchandisePostRepository: Repository<Merchandise>,
    @InjectRepository(MerchandiseOption)
    private readonly merchandiseOptionRepository: Repository<MerchandiseOption>,
    private dataSource: DataSource,
  ) {}

  // cartItem 장바구니 저장
  async create(createCartDto: CreateCartDto, userId: number, cookies: any) {
    const { merchandiseId, merchandiseOptionId, quantity } = createCartDto;

    //상품 유효성 체크
    const merchandise = await this.merchandisePostRepository.findOne({
      where: { merchandiseId },
    });

    // 상품 유효성 체크
    if (!merchandise) {
      throw new NotFoundException('상품이 존재하지 않습니다.');
    }

    //상품 옵션 가져오기
    const merchandiseOption = await this.merchandiseOptionRepository.findOne({
      where: { id: merchandiseOptionId },
      relations: ['merchandise'],
    });

    //상품 id 안에 있는 옵션 id가 맞는지 유효성 체크
    if (
      !merchandiseOption ||
      merchandiseOption.merchandise.merchandiseId !== merchandise.merchandiseId
    ) {
      throw new NotFoundException('해당 상품 내 옵션이 존재하지 않습니다.');
    }

    if (quantity <= 0) {
      throw new BadRequestException('수량을 입력해주세요');
    }

    //트랜잭션 시작
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();
    try {
      //유저가 id가 있을 경우 user 조회 > cart저장
      if (userId) {
        // 유저 추출 및 카트 유효성 검사
        const user = await queryRunner.manager.findOne(User, {
          where: { userId },
        });

        // 카트 데이터 조회
        let cart = await queryRunner.manager.findOne(Cart, {
          where: { user: { userId } },
          relations: ['user'],
        });

        // 카트가 없다면 생성
        if (!cart) {
          cart = await queryRunner.manager.save(Cart, { user });
        }

        // 장바구니에 입력한 동일 상품 id && 옵션 id 있는지 확인
        const merchandiseCheck = await queryRunner.manager.findOne(CartItem, {
          where: {
            merchandise: { merchandiseId: createCartDto.merchandiseId },
            merchandiseOption: { id: createCartDto.merchandiseOptionId },
          },
          relations: ['merchandisePost', 'merchandiseOption'],
        });

        // 있다면 수량만 추가 , 없다면 새로 카트에 저장
        let cartItem;
        if (merchandiseCheck) {
          merchandiseCheck.quantity += quantity; // 기존 수량에 추가
          cartItem = await queryRunner.manager.save(CartItem, merchandiseCheck);
        } else {
          cartItem = await queryRunner.manager.save(CartItem, {
            merchandisePost: merchandise,
            merchandiseOption,
            quantity,
            cart,
          });
        }

        //트랜잭션 종료
        await queryRunner.commitTransaction();

        // 총 금액 합계
        const totalPrice =
          cartItem.merchandiseOption.optionPrice * cartItem.quantity +
          cartItem.merchandisePost.deliveryPrice;

        return {
          status: HttpStatus.OK,
          message: '카트 저장에 성공했습니다.',
          data: {
            cartId: cart.id,
            merchandisePostId: cartItem.merchandisePost.id,
            merchandiseTitle: cartItem.merchandisePost.title,
            merchandiseOptionId: cartItem.merchandiseOption.id,
            merchandiseOptionName: cartItem.merchandiseOption.optionName,
            merchandiseOptionPrice: cartItem.merchandiseOption.optionPrice,
            quantity: cartItem.quantity,
            deliveryPrice: cartItem.merchandisePost.deliveryPrice,
            totalPrice,
          },
        };
      } // 비회원일 경우
      else {
        const guestCart = cookies['guestCart']
          ? JSON.parse(cookies['guestCart'])
          : [];

        // 동일 상품 및 옵션이 있는지 확인
        let cartItem = guestCart.find(
          (item) =>
            item.merchandisePostId === merchandise.merchandiseId &&
            item.merchandiseOptionId === merchandiseOption.id,
        );

        if (cartItem) {
          // 동일 상품이 있으면 수량만 추가
          cartItem.quantity += quantity;
        } else {
          // 동일 상품이 없으면 새로운 아이템 추가
          cartItem = {
            cartItemId:
              guestCart.length > 0
                ? guestCart[guestCart.length - 1].cartItemId + 1
                : 1,
            merchandisePostId: merchandise.merchandiseId,
            merchandiseName: merchandise.merchandiseName,
            merchandiseOptionId: merchandiseOption.id,
            merchandiseOptionName: merchandiseOption.optionName,
            quantity,
          };
          guestCart.push(cartItem);
        }

        await queryRunner.commitTransaction();

        // 비회원 카트 쿠키 설정
        return {
          status: HttpStatus.OK,
          message: '비회원 카트에 저장되었습니다.',
          data: { guestCart },
        };
      }
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  // 카트 전체 조회
  async findAll(userId: number, guestCart?: string) {
    if (userId) {
      // UserId로 갖고 있는 카트 조회
      const cart = await this.cartRepository.findOne({
        where: { user: { userId } },
      });

      if (!cart) {
        throw new NotFoundException('카트가 존재하지 않습니다.');
      }

      const cartItem = await this.cartItemRepository.find({
        where: { cart }, // cartId로 CartItem을 조회
        relations: ['merchandise', 'merchandiseOption'],
      });

      const cartItems = cartItem.map((cartItem) => ({
        cartItemId: cartItem.id,
        merchandiseId: cartItem.merchandise.merchandiseId,
        merchandiseTitle: cartItem.merchandise.merchandiseName,
        price: cartItem.merchandise.price,
        merchandiseOptionName: cartItem.merchandiseOption.optionName,
        quantity: cartItem.quantity,
      }));

      return {
        status: HttpStatus.OK,
        message: '카트 전체 조회에 성공하셨습니다.',
        data: cartItems,
      };
    } // 비회원의 경우
    else if (guestCart) {
      const cart = JSON.parse(guestCart) || [];

      return {
        status: HttpStatus.OK,
        message: '비회원 카트 조회에 성공하셨습니다.',
        data: cart,
      };
    }
  }

  async remove(userId: number, cartItemId: number, cookies: any) {
    if (userId) {
      // 회원의 경우 UserId로 갖고 있는 카트 조회
      const cart = await this.cartRepository.findOne({
        where: { user: { userId } },
      });
      if (!cart) {
        throw new NotFoundException('장바구니가 존재하지 않습니다.');
      }

      // 조회된 cart와 입력한 cartId를 통해 CartItem을 조회
      const cartItem = await this.cartItemRepository.findOne({
        where: { cart, id: cartItemId },
        relations: ['merchandise', 'merchandiseOption'],
      });

      if (!cartItem) {
        throw new NotFoundException(
          '해당 상품은 장바구니에 존재하지 않습니다.',
        );
      }

      await this.cartItemRepository.delete(cartItemId);

      return {
        status: HttpStatus.OK,
        message: '장바구니 상품 삭제에 성공하였습니다.',
        data: { cartItemId },
      };
    } else {
      // 비회원의 경우
      const guestCart = cookies['guestCart']
        ? JSON.parse(cookies['guestCart'])
        : [];

      // 상품 유효성 검증
      const cartItemIdCheck = guestCart.find(
        (item) => item.cartItemId === cartItemId,
      );

      if (!cartItemIdCheck) {
        throw new NotFoundException(
          '해당 상품은 장바구니에 존재하지 않습니다.',
        );
      }

      // 해당 아이템을 비회원 카트에서 제거
      const updateCart = guestCart.filter(
        (item) => item.cartItemId !== cartItemId,
      );

      return {
        status: HttpStatus.OK,
        message: '비회원 카트 아이템 삭제에 성공하였습니다.',
        updateCart,
      };
    }
  }

  async notUserCartSave(userId: number, cookies: any) {
    const guestCart = cookies['guestCart']
      ? JSON.parse(cookies['guestCart'])
      : [];

    // 유저 추출 및 카트 유효성 검사
    const user = await this.userRepository.findOne({
      where: { userId },
    });

    let cart = await this.cartRepository.findOne({
      where: { user: { userId } },
      relations: ['user'],
    });

    //유저 카트가 없다면 카트 생성

    if (!cart) {
      cart = await this.cartRepository.save({
        user,
      });
    }

    // 쿠키 내 각 상품 id + 옵션 id 데이터를 추출하여 userCartItem에 저장하기
    for (const item of guestCart) {
      // merchandise 추출
      const merchandise = await this.merchandisePostRepository.findOne({
        where: { merchandiseId: item.merchandisePostId },
      });
      // merchandiseOption 추출
      const merchandiseOption = await this.merchandiseOptionRepository.findOne({
        where: { id: item.merchandiseOptionId },
      });
      // userCart에 저장
      await this.cartItemRepository.save({
        cart,
        merchandise,
        merchandiseOption,
        quantity: item.quantity,
      });
    }

    return {
      status: HttpStatus.OK,
      message: '비회원 카트가 성공적으로 사용자 카트로 이전되었습니다.',
    };
  }

  async cartQuantity(
    userId: number,
    cartItemId: number,
    cookies: any,
    updateCadrDto: UpdateCartDto,
  ) {
    if (userId) {
      // 회원의 경우 UserId로 갖고 있는 카트 조회
      const cart = await this.cartRepository.findOne({
        where: { user: { userId } },
      });
      if (!cart) {
        throw new NotFoundException('장바구니가 존재하지 않습니다.');
      }

      // 조회된 cart와 입력한 cartId를 통해 CartItem을 조회
      const cartItem = await this.cartItemRepository.findOne({
        where: { cart, id: cartItemId },
        relations: ['merchandisePost', 'merchandiseOption'],
      });

      if (!cartItem) {
        throw new NotFoundException(
          '해당 상품은 장바구니에 존재하지 않습니다.',
        );
      }

      cartItem.quantity = updateCadrDto.quantity;
      await this.cartItemRepository.save(cartItem);

      return {
        status: HttpStatus.OK,
        message: '장바구니 수정에 성공하였습니다..',
        data: { cartItemId },
      };
    } else {
      // 비회원의 경우
      const guestCart = cookies['guestCart']
        ? JSON.parse(cookies['guestCart'])
        : [];

      // 상품 유효성 검증
      const cartItemIdCheck = guestCart.find(
        (item) => item.cartItemId === cartItemId,
      );

      if (!cartItemIdCheck) {
        throw new NotFoundException(
          '해당 상품은 장바구니에 존재하지 않습니다.',
        );
      }

      // 비회원 카트에서 아이템의 수량만 업데이트
      const updateCart = guestCart.map((item) => {
        if (item.cartItemId === cartItemId) {
          // 아이템을 찾았을 때 수량을 업데이트
          return { ...item, quantity: updateCadrDto.quantity };
        }
        return item; // 아이템이 아닌 경우 그대로 반환
      });

      return {
        status: HttpStatus.OK,
        message: '비회원 카트의 아이템 수량이 수정되었습니다.',
        data: { updateCart },
      };
    }
  }
}
