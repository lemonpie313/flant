import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { User } from 'src/user/entities/user.entity';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart.item.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { MerchandisePost } from 'src/merchandise/entities/merchandise-post.entity';
import { MerchandiseOption } from 'src/merchandise/entities/marchandise-option.entity';
import { stat } from 'fs';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,
    @InjectRepository(MerchandisePost)
    private readonly merchandisePostRepository: Repository<MerchandisePost>,
    @InjectRepository(MerchandiseOption)
    private readonly merchandiseOptionRepository: Repository<MerchandiseOption>,
  ) {}

  // 카트 생성
  async create(createCartDto: CreateCartDto, userId: number) {
    const { merchandiseId, merchandiseOptionId, quantity } = createCartDto;

    //상품 유효성 체크
    const merchandise = await this.merchandisePostRepository.findOne({
      where: { id: merchandiseId },
    });

    // 추가하려는 상품이 없을 경우 반환
    if (!merchandise) {
      throw new NotFoundException('상품이 존재하지 않습니다.');
    }

    //상품 옵션 가져오기
    const merchandiseOption = await this.merchandiseOptionRepository.findOne({
      where: { id: merchandiseOptionId },
      relations: ['merchandisePost'],
    });

    //상품 id 안에 있는 옵션 id가 맞는지 유효성 체크
    if (
      !merchandiseOption ||
      merchandiseOption.merchandisePost.id !== merchandise.id
    ) {
      throw new NotFoundException('해당 상품 내 옵션이 존재하지 않습니다.');
    }

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
        merchandisePost: merchandise,
        merchandiseOption,
        quantity,
        cart: userCart,
      });
    } else {
      userCart = await this.cartItemRepository.save({
        merchandisePost: merchandise,
        merchandiseOption,
        quantity,
        cart,
      });
    }

    return {
      status: HttpStatus.OK,
      message: '카트 저장에 성공했습니다.',
      data: {
        merchandisePostId: userCart.merchandisePost.id,
        merchandiseTitle: userCart.merchandisePost.title,
        merchandiseOption: userCart.merchandiseOption.optionName,
        merchandiseOptionPrice: userCart.merchandiseOption.optionPrice,
      },
    };
  }

  // 카트 전체 조회
  async findAll(userId: number) {
    // UserId로 갖고 있는 카트 조회
    const cart = await this.cartRepository.findOne({
      where: { user: { userId } },
    });

    if (!cart) {
      throw new NotFoundException('카트가 존재하지 않습니다.');
    }

    const cartItem = await this.cartItemRepository.find({
      where: { cart }, // cartId로 CartItem을 조회
      relations: ['merchandisePost', 'merchandiseOption'],
    });

    const cartItems = cartItem.map((cartItem) => ({
      cartItemId: cartItem.id,
      merchandiseId: cartItem.merchandisePost.id,
      merchandiseTitle: cartItem.merchandisePost.title,
      merchandiseOptionName: cartItem.merchandiseOption.optionName,
      merchandiseOptionPrice: cartItem.merchandiseOption.optionPrice,
    }));

    return {
      status: HttpStatus.OK,
      message: '카트 전체 조회에 성공하셨습니다.',
      data: cartItems,
    };
  }

  async remove(cartItemId: number, userId: number) {
    // UserId로 갖고 있는 카트 조회
    const cart = await this.cartRepository.findOne({
      where: { user: { userId } },
    });
    if (!cart) {
      throw new NotFoundException('카트가 존재하지 않습니다.');
    }

    // 조회된 cart와 입력한 cartId를 통해 CartItem을 조회
    let cartItem = await this.cartItemRepository.findOne({
      where: { cart, id: cartItemId },
      relations: ['merchandisePost', 'merchandiseOption'],
    });
    if (!cartItem) {
      throw new NotFoundException('해당 카트아이템은 존재하지 않습니다.');
    }

    await this.cartItemRepository.delete(cartItemId);
    return {
      status: HttpStatus.OK,
      message: '카트 아이템 삭제에 성공하였습니다',
      data: { cartItemId },
    };
  }
}
