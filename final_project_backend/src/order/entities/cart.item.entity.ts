import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ProductPost } from 'src/product/entities/product.post.entity';
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

  @ManyToOne(() => ProductPost, (productPost) => productPost.cartItem)
  productPost: ProductPost;

  @Column()
  quantity: number;
}
