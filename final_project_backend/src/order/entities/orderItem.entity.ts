import { IsNumber } from 'class-validator';

import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from './order.entity';

@Entity('order_items')
export class OrderItem {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @IsNumber()
  @Column()
  merchandisePostId: number;

  @IsNumber()
  @Column()
  merchandiseOption: number;

  @IsNumber()
  @Column()
  merchandiseOptionPrice: number;

  @IsNumber()
  @Column()
  quantity: number;

  //유저연결
  @ManyToOne(() => Order, (order) => order.orderItem, { onDelete: 'CASCADE' })
  order: Order;
}
