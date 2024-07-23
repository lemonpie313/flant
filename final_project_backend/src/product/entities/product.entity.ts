import { IsNotEmpty, IsString } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ProductCategory } from './product.category.entity';
import { MerchandiseImage } from 'src/merchandise/entities/merchandise-image.entity';
import { MerchandisePost } from '../../merchandise/entities/merchandise-post.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  /**
   * 상점 코드
   * @example "ABCDEFGHI11"
   */
  //코드가 자동생성되는건지 확인 필요
  @IsNotEmpty({ message: '상점 코드를 입력해주세요' })
  @IsString()
  @Column()
  productCode: string;

  /**
   * 상점명
   * @example "상점명"
   */
  @IsNotEmpty({ message: '상품명을 입력해주세요' })
  @IsString()
  @Column()
  name: string;

  /**
   * 상세정보
   * @example "이 상점의 정보를 입력해주세요 "
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
  @OneToMany(
    () => MerchandiseImage,
    (merchandiseImage) => merchandiseImage.products,
  )
  merchandiseImage: MerchandiseImage[];

  /**
   * 상품 게시물
   */
  @OneToMany(
    () => MerchandisePost,
    (merchandisePost) => merchandisePost.product,
  )
  merchandisePosts: MerchandisePost[];
  /**
   * 카테고리
   */
  @OneToMany(
    () => ProductCategory,
    (productCategory) => productCategory.products,
  )
  productCategorys: ProductCategory[];
}
