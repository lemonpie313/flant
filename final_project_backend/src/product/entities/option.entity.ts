import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { ProductPost } from './product.post.entity';

@Entity('options')
export class Option {
  @PrimaryGeneratedColumn({ unsigned: true })
  @Column()
  optionId: number;

  /**
   * 옵션
   * @example "옵션 입력"
   */
  //enum 진행 체크
  @IsNotEmpty({ message: '옵션을 입력해주세요' })
  @IsString()
  @Column()
  optioName: string;

  /**
   * 가격
   * @example 50000
   */
  @IsNumber()
  @Column()
  price: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  //상품 연결
  @ManyToOne(() => ProductPost, (productPost) => productPost.option)
  productPost: ProductPost[];
}
