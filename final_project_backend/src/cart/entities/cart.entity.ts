import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CartItem } from './cart.item.entity';
import { Order } from '../../order/entities/order.entity';
import { User } from 'src/user/entities/user.entity';

@Entity('carts')
export class Cart {
  @PrimaryGeneratedColumn()
  id: number;

  // 카트아이템 연결
  @OneToMany(() => CartItem, (cartItem) => cartItem.cart, { cascade: true })
  cartItem: CartItem[];

  //주문 연결
  @OneToOne(() => Order, (order) => order.cart)
  order: Order;

  //유저연결
  @OneToOne(() => User, (user) => user.cart)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
