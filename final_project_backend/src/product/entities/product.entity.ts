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

  @Column()
  productCode: string;

  @Column()
  name: string;

  @Column()
  detailInfo: string;

  @Column()
  artist: string;

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
   * 상품 게시물
   */
  @OneToMany(
    () => MerchandisePost,
    (merchandisePost) => merchandisePost.product,
    {
      cascade: true,
      onDelete: 'CASCADE',
    },
  )
  merchandisePosts: MerchandisePost[];

  /**
   * 카테고리
   */
  @OneToMany(
    () => ProductCategory,
    (productCategory) => productCategory.product,
    {
      cascade: true,
      onDelete: 'CASCADE',
    },
  )
  productCategory: ProductCategory[];
}
