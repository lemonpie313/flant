import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Product } from './product.entity';
import { ProductPost } from './product.post.entity';
import { IsNotEmpty, IsString } from 'class-validator';

@Entity('product_images')
export class ProductImage {
  @PrimaryGeneratedColumn({ unsigned: true })
  @Column()
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
  @ManyToOne(() => Product, (product) => product.productImage)
  product: Product[];

  // 상품게시물 연결
  @ManyToOne(() => ProductPost, (productPost) => productPost.productImage)
  productPost: ProductPost[];
}
