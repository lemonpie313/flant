import { IsNotEmpty, IsNumber, IsString, IsUrl } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Product } from '../../product/entities/product.entity';

import { MerchandiseOption } from './marchandise-option.entity';
import { MerchandiseImage } from './merchandise-image.entity';
import { CartItem } from 'src/cart/entities/cart.item.entity';
import { Manager } from 'src/admin/entities/manager.entity';

@Entity('merchandise_post')
export class MerchandisePost {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  /**
   * 상품 이름
   * @example "상품 이름"
   */
  @IsNotEmpty({ message: '상품 이름을 입력해주세요' })
  @IsString()
  @Column()
  productName: string;

  /**
   * 상품 썸네일
   * @example "thunbnail.jpg"
   */
  @IsNotEmpty({ message: '상품 썸네일 URL을 입력해주세요' })
  @IsUrl()
  @Column()
  thumbnail: string;

  /**
   * 내용
   * @example "상품 내용"
   */
  @IsNotEmpty({ message: '내용을 입력해주세요' })
  @IsString()
  @Column()
  content: string;

  /**
   * 가격
   * @example 10000
   */
  @IsNotEmpty({ message: '가격을 입력해주세요' })
  @IsNumber()
  @Column()
  price: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // 굿즈샵 연결
  @ManyToOne(() => Product, (product) => product.merchandisePosts)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  // 상품 이미지 연결
  @OneToMany(
    () => MerchandiseImage,
    (merchandiseImage) => merchandiseImage.merchandisePost,
    { onDelete: 'CASCADE' },
  )
  merchandiseImage: MerchandiseImage[];

  // 옵션 연결
  @OneToMany(
    () => MerchandiseOption,
    (merchandiseOption) => merchandiseOption.merchandisePost,
    { onDelete: 'CASCADE' },
  )
  merchandiseOption: MerchandiseOption[];

  // 주문 연결
  @OneToMany(() => CartItem, (cartItem) => cartItem.merchandisePost, {
    onDelete: 'CASCADE',
  })
  cartItems: CartItem[];

  //매니저 연결
  @ManyToOne(() => Manager, (manager) => manager.merchandisePost, {
    onDelete: 'CASCADE',
  })
  manager: Manager;
}
