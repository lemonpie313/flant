import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { MerchandisePost } from '../../merchandise/entities/merchandise-post.entity';

import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Cart } from './cart.entity';

@Entity('cart_items')
export class CartItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Cart, (cart) => cart.cartItem)
  cart: Cart;

  @ManyToOne(
    () => MerchandisePost,
    (merchandisePost) => merchandisePost.cartItems,
  )
  merchandisePost: MerchandisePost[];

  @Column()
  quantity: number;
}
