import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { MerchandisePost } from './merchandise-post.entity';

@Entity('merchandise_option')
export class MerchandiseOption {
  @PrimaryGeneratedColumn({ unsigned: true })
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
  @ManyToOne(
    () => MerchandisePost,
    (merchandisePost) => merchandisePost.merchandiseOption,
  )
  merchandisePost: MerchandisePost[];
}
