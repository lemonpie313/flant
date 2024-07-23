import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CartItem } from './cart.item.entity';
import { Order } from './order.entity';

@Entity('carts')
export class Cart {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => CartItem, (cartItem) => cartItem.cart)
  cartItem: CartItem;

  @OneToMany(() => Order, (order) => order.cart)
  order: Order;

  //   //유저연결
  //   @ManyToOne(() => User, (user) => user.cart)
  //   user: User;
}
