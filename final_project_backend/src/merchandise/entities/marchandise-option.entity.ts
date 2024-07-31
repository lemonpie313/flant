import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { MerchandisePost } from './merchandise-post.entity';
import { CartItem } from 'src/cart/entities/cart.item.entity';

@Entity('merchandise_option')
export class MerchandiseOption {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @Column()
  optionName: string;

  @Column()
  optionPrice: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  //상품 연결
  @ManyToOne(
    () => MerchandisePost,
    (merchandisePost) => merchandisePost.merchandiseOption,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'merchandisePost_id' })
  merchandisePost: MerchandisePost;

  // 주문 연결
  @OneToMany(() => CartItem, (cartItem) => cartItem.merchandiseOption, {
    onDelete: 'CASCADE',
  })
  cartItem: CartItem[];
}
