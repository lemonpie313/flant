import { IsNotEmpty, IsString } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ProductImage } from './product.image.entity';
import { ProductPost } from './product.post.entity';
import { ProductCategory } from './product.category.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn({ unsigned: true })
  @Column()
  shopId: number;

  /**
   * 상품 코드
   * @example "ABCDEFGHI11"
   */
  //코드가 자동생성되는건지 확인 필요
  @IsNotEmpty({ message: '상품 코드를 입력해주세요' })
  @IsString()
  @Column()
  productCode: string;

  /**
   * 상품명
   * @example "상품명"
   */
  @IsNotEmpty({ message: '상품명을 입력해주세요' })
  @IsString()
  @Column()
  name: string;

  /**
   * 상세정보
   * @example "이 상품의 정보를 입력해주세요 "
   */
  @IsNotEmpty({ message: '상세정보를 입력해주세요' })
  @IsString()
  @Column()
  detailInfo: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  //   /**
  //    * 매니저
  //    */
  //   @ManyToOne(() => Manager, (manager) => manager.products)
  //   manager: Manager[];

  /**
   * 상품 이미지
   */
  @OneToMany(() => ProductImage, (productImage) => productImage.product)
  productImage: ProductImage[];

  /**
   * 상품 게시물
   */
  @OneToMany(() => ProductPost, (productPost) => productPost.product)
  productPost: ProductPost[];

  /**
   * 카테고리
   */
  @OneToMany(
    () => ProductCategory,
    (productCategory) => productCategory.product,
  )
  productCategory: ProductCategory[];
}
