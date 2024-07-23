import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { IsNotEmpty, IsString } from 'class-validator';
import { Product } from 'src/product/entities/product.entity';
import { MerchandisePost } from './merchandise-post.entity';

@Entity('merchandise_image')
export class MerchandiseImage {
  @PrimaryGeneratedColumn({ unsigned: true })
  goodsImageId: number;

  /**
   * 이미지 URL
   * @example "abcdf.jpg"
   */
  @IsNotEmpty({ message: '이미지 URL을 입력해주세요' })
  @IsString()
  @Column()
  imageUrl: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // 굿즈샵 연결
  @ManyToOne(() => Product, (product) => product.merchandiseImage)
  products: Product[];

  // 상품게시물 연결
  @ManyToOne(
    () => MerchandisePost,
    (merchandisePost) => merchandisePost.merchandiseImage,
  )
  merchandisePost: MerchandisePost[];
}
