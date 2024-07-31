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

  async create(createCartDto: CreateCartDto, userId: number) {
    const { merchandiseId, merchandiseOptionId, quantity } = createCartDto;

    //상품 유효성 체크
    const merchandise = await this.merchandisePostRepository.findOne({
      where: { id: merchandiseId },
    });

    // 입력한 상품이 없을 경우 반환
    if (!merchandise) {
      throw new NotFoundException('상품이 존재하지 않습니다.');
    }

    //상품 옵션 체크 가져오기
    const merchandiseOption = await this.merchandiseOptionRepository.findOne({
      where: { id: merchandiseOptionId },
      relations: ['merchandisePost'],
    });

    //상품 id 안에 있는 옵션 id가 맞는지 유효성 체크
    if (merchandiseOption.merchandisePost.id !== merchandise.id) {
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

    //유저 카트가 없다면 생성
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
      return userCart;
    }

    //카트가 있다면 해당 카트에 추가 저장
    userCart = await this.cartItemRepository.save({
      merchandisePost: merchandise,
      merchandiseOption,
      quantity,
      cart,
    });

    return userCart;
  }

  findAll() {
    return `This action returns all cart`;
  }

  async findOne(cartId: number) {
    const cart = await this.cartRepository.findOne({
      where: { id: cartId },
      relations: ['cartItem'],
    });

    if (!cart) {
      // 카트가 없을 경우 생성하여 반환
    }

    //카트가 있다면 있던 카트를 반환, 없었다면 생성된 카트를 반환하

    return {
      status: HttpStatus.OK,
      message: '카트 조회에 성공하였습니다.',
      data: cart,
    };
  }

  update(id: number, updateCartDto: UpdateCartDto) {
    return `This action updates a #${id} cart`;
  }

  remove(id: number) {
    return `This action removes a #${id} cart`;
  }
}
