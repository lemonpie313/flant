import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { User } from 'src/user/entities/user.entity';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart.item.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Merchandise } from 'src/merchandise/entities/merchandise.entity';
import { MerchandiseOption } from 'src/merchandise/entities/marchandise-option.entity';
import { stat } from 'fs';
import { query } from 'express';
import { HttpRequest } from 'aws-sdk';

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
  ) {}

  // 카트 생성
  async create(createCartDto: CreateCartDto, userId: number, cookies: any) {
    const { merchandiseId, merchandiseOptionId, quantity } = createCartDto;

    //상품 유효성 체크
    const merchandise = await this.merchandisePostRepository.findOne({
      where: { merchandiseId },
    });

    // 추가하려는 상품이 없을 경우 반환
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

    // 유효성 검증 후 유저 및 비회원 카트로 진행

    if (userId) {
      // 유저 추출 및 카트 유효성 검사
      const user = await this.userRepository.findOne({
        where: { userId },
      });

      const cart = await this.cartRepository.findOne({
        where: { user: { userId } },
        relations: ['user'],
      });

      //유저 카트가 없다면 생성, 있다면 해당 카트에 저장
      let userCart;
      if (!cart) {
        userCart = await this.cartRepository.save({
          user,
        });

        await this.cartItemRepository.save({
          merchandise: merchandise,
          merchandiseOption,
          quantity,
          cart: userCart,
        });
      } else {
        userCart = await this.cartItemRepository.save({
          merchandise: merchandise,
          merchandiseOption,
          quantity,
          cart,
        });
      }

      return {
        status: HttpStatus.OK,
        message: '카트 저장에 성공했습니다.',
        data: {
          merchandisePostId: userCart.merchandise.id,
          merchandiseTitle: userCart.merchandise.title,
          merchandiseOption: userCart.merchandiseOption.optionName,
          merchandiseOptionPrice: userCart.merchandiseOption.optionPrice,
          quantity: userCart.quantity,
        },
      };
    } else {
      // 비회원일 경우
      const guestCart = cookies['guestCart']
        ? JSON.parse(cookies['guestCart'])
        : [];

      // 비회원 카트에 아이템 추가
      guestCart.push({
        cartItemId:
          guestCart.length > 0
            ? guestCart[guestCart.length - 1].cartItemId + 1
            : 1,
        merchandisePostId: merchandise.merchandiseId,
        merchandiseName: merchandise.merchandiseName,
        price: merchandise.price,
        merchandiseOptionId: merchandiseOption.id,
        merchandiseOptionName: merchandiseOption.optionName,
        quantity,
      });

      // 비회원 카트 쿠키 설정
      return {
        status: HttpStatus.OK,
        message: '비회원 카트에 저장되었습니다.',
        data: { guestCart },
      };
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
      console.log(cart);
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

      // //옵션 총합 계산 << 주문 시 계산 됨
      // let totalPrice = 0;
      // for (let i = 0; i < cartItems.length; i++) {
      //   totalPrice +=
      //     cartItems[i].merchandiseOptionPrice * cartItem[i].quantity;
      // }

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
      const cartItemIdCheck = guestCart.some(
        (guestCart) => guestCart.cartItemId === cartItemId,
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
      await this.cartRepository.save({
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
}
