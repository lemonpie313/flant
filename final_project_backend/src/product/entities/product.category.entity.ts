import { IsNotEmpty, IsString } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Product } from './product.entity';

@Entity('product_categorys')
export class ProductCategory {
  @PrimaryGeneratedColumn({ unsigned: true })
  categoryId: number;

  /**
   * 카테고리명
   * @example "카테고리 선택"
   */
  //enum 적용?
  @IsNotEmpty({ message: '카테고리명을 입력해주세요' })
  @IsString()
  @Column()
  name: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  /**
   * 굿즈샵 연결
   */
  @ManyToOne(() => Product, (Product) => Product.productCategorys)
  products: Product[];
}
