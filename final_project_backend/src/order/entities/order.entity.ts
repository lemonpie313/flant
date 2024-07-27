import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';

import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ProgressTypes } from '../types/progress.types';
import { Cart } from './cart.entity';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  /**
   * 주문번호
   */
  @IsString()
  @Column()
  orderNumber: string;

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

  // //유저연결
  // @ManyToOne(() => User, (user) => user.order)
  // user: User;

  //카트연결
  @ManyToOne(() => Cart, (cart) => cart.order)
  cart: Cart;
}
