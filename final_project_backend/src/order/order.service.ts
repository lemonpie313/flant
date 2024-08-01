import {
  BadRequestException,
  ConsoleLogger,
  Injectable,
  NotAcceptableException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { User } from 'src/user/entities/user.entity';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from '../cart/entities/cart.entity';
import { CartItem } from '../cart/entities/cart.item.entity';
import { ExceptionsHandler } from '@nestjs/core/exceptions/exceptions-handler';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,
  ) {}

  async create(userId: number) {
    const user = await this.userRepository.findOne({
      where: { userId },
      relations: ['cart'],
    });

    if (user.cart === null) {
      throw new NotAcceptableException('카트가 존재하지 않습니다.');
    }

    //카트 아이템 조회
    const cartItem = await this.cartItemRepository.find({
      where: { cart: user.cart }, // cartId로 CartItem을 조회
      relations: ['merchandisePost', 'merchandiseOption'],
    });

    // 각 상품의 옵션별 가격 + 배송비 합산을 계산, 새로은 Map을 만들어 저장
    const processedMerchandisePosts = new Map();
    let totalPrice = 0;

    cartItem.forEach((item) => {
      const merchandisePostId = item.merchandisePost.id;

      // 상품 id 당 배달비는 1번만 계산
      if (!processedMerchandisePosts.has(merchandisePostId)) {
        totalPrice += item.merchandisePost.deliveryPrice;
        processedMerchandisePosts.set(merchandisePostId, {});
        console.log(processedMerchandisePosts);
      }

      // 옵션 * 수량 가격 추가
      if (item.merchandiseOption) {
        totalPrice += item.merchandiseOption.optionPrice * item.quantity;
      }
    });

    //포인트 부족 시 오류 반환
    if (user.point < totalPrice) {
      throw new BadRequestException('포인트가 부족합니다.');
    }

    // 주문 생성 >> 여기서 막히는 중
    // const createOrder = await this.orderRepository.save({});
    //유저 포인트에서 합산 금액 차감
    // user.point -= totalPrice;
    // await this.userRepository.save(user);

    //기존 카트 삭제
    // await this.cartRepository.delete(user.cart.id);

    return 'This action adds a new order';
  }

  findAll() {
    return `This action returns all order`;
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
