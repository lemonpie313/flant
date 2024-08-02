import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';

import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ProgressTypes } from '../types/progress.types';
import { Cart } from '../../cart/entities/cart.entity';
import { User } from 'src/user/entities/user.entity';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  // /**
  //  * 주문번호
  //  */
  // @IsString()
  // @Column()
  // orderNumber: string;

  @IsNumber()
  @Column()
  merchandisePostId: number;

  @IsNumber()
  @Column()
  merchandiseOption: number;

  @IsNumber()
  @Column()
  totalPrice: number;

  @IsNumber()
  @Column()
  quantity: number;
  /**
   * 진행상태
   */
  @IsEnum(ProgressTypes)
  @Column({ type: 'enum', enum: ProgressTypes, default: 'ready' })
  progress: ProgressTypes;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  //유저연결
  @ManyToOne(() => User, (user) => user.order)
  user: User;

  //카트연결
  @OneToOne(() => Cart, (cart) => cart.order)
  cart: Cart;
}
