import {
  BadRequestException,
  ConsoleLogger,
  HttpStatus,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';

import { User } from 'src/user/entities/user.entity';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from '../cart/entities/cart.entity';
import { CartItem } from '../cart/entities/cart.item.entity';
import { ExceptionsHandler } from '@nestjs/core/exceptions/exceptions-handler';
import { OrderItem } from './entities/orderItem.entity';
import { MerchandisePost } from 'src/merchandise/entities/merchandise-post.entity';
import { MerchandiseOption } from 'src/merchandise/entities/marchandise-option.entity';

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
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    @InjectRepository(MerchandisePost)
    private readonly merchandisePost: Repository<MerchandisePost>,
    @InjectRepository(MerchandiseOption)
    private readonly merchandiseOption: Repository<MerchandiseOption>,
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
    const plusMerchandisePosts = new Map();
    let totalPrice = 0;

    cartItem.forEach((item) => {
      const merchandisePostId = item.merchandisePost.id;

      // 상품 id 당 배달비는 1번만 계산
      if (!plusMerchandisePosts.has(merchandisePostId)) {
        totalPrice += item.merchandisePost.deliveryPrice;
        plusMerchandisePosts.set(merchandisePostId, {});
      }

      // 옵션 * 수량 가격 추가
      if (item.merchandiseOption) {
        totalPrice += item.merchandiseOption.optionPrice * item.quantity;
      }
    });

    //order 먼저 생성
    const order = await this.orderRepository.save({ totalPrice, user });

    let orderItems = cartItem.map((item) => ({
      order: order, // 이미 저장된 주문
      merchandisePostId: item.merchandisePost.id,
      merchandiseOption: item.merchandiseOption.id,
      merchandiseOptionPrice: item.merchandiseOption.optionPrice,
      quantity: item.quantity,
    }));

    // 생성된 배열 OrderItem 저장
    await this.orderItemRepository.save(orderItems);

    //포인트 부족 시 오류 반환
    if (user.point < totalPrice) {
      throw new BadRequestException('포인트가 부족합니다.');
    }

    //유저 포인트에서 합산 금액 차감
    user.point -= totalPrice;
    await this.userRepository.save(user);

    //기존 카트 삭제
    await this.cartRepository.delete(user.cart.id);

    return {
      status: HttpStatus.CREATED,
      message: '주문이 완료되었습니다.',
      data: {
        orderId: order.id,
        totalPrice: order.totalPrice,
        process: order.progress,
      },
    };
  }

  //주문 전체 조회
  async findAll(userId: number) {
    const data = await this.orderRepository.find({
      where: { user: { userId } },
      relations: ['orderItem'],
    });

    return {
      status: HttpStatus.OK,
      message: '주문내역 조회에 성공하였습니다.',
      data,
    };
  }

  //주문 상세 조회
  async findOne(id: number, userId: number) {
    const data = await this.orderRepository.findOne({
      where: { id, user: { userId } },
    });
    if (!data) {
      throw new NotFoundException('주문이 존재하지 않습니다.');
    }
    return {
      status: HttpStatus.OK,
      message: '주문내역 상세 조회에 성공하였습니다.',
      data,
    };
  }

  // 주문 취소
  async update(id: number) {
    const data = await this.orderRepository.findOne({
      where: { id },
    });
    if (!data) {
      throw new NotFoundException('주문이 존재하지 않습니다.');
    }

    //주문 상태에 따라 불가능한 로직 추가 필요
    // if (data.progress == 'deliveryFinish') {
    //   throw new NotFoundException('배송이 완료된 주문입니다.');
    // }
    // if (data.progress == 'ready') {
    //   throw new NotFoundException('주문 취소가 불가능합니다.');
    // }

    return {
      statsu: HttpStatus.OK,
      message: ' 주문 취소 요청이 되었습니다',
      orderId: data.id,
    };
  }
}
