import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
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
import { CartItem } from 'src/order/entities/cart.item.entity';

@Entity('merchandise_post')
export class MerchandisePost {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  /**
   * 제목
   * @example "상품 제목"
   */
  @IsNotEmpty({ message: '제목을 입력해주세요' })
  @IsString()
  @Column()
  title: string;

  /**
   * 썸네일
   * @example "thunbnail.jpg"
   */
  @IsNotEmpty({ message: '썸네일 URL을 입력해주세요' })
  @IsString()
  @Column()
  thumbnail: string;

  /**
   * 상품 판매명
   * @example "상품 판매명"
   */
  @IsNotEmpty({ message: '상품판매명을 입력해주세요' })
  @IsString()
  @Column()
  salesName: string;

  /**
   * 내용
   * @example "상품 내용"
   */
  @IsNotEmpty({ message: '내용을 입력해주세요' })
  @IsString()
  @Column()
  content: string;

  /**
   * 배송비
   * @example 3000
   */
  @IsNotEmpty({ message: '배송비를 입력해주세요' })
  @IsNumber()
  @Column()
  deliveryPrice: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // 굿즈샵 연결
  @ManyToOne(() => Product, (product) => product.merchandisePosts, {
    cascade: true,
  })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  // 상품 이미지 연결
  @OneToMany(
    () => MerchandiseImage,
    (merchandiseImage) => merchandiseImage.merchandisePost,
    { cascade: true },
  )
  merchandiseImage: MerchandiseImage[];

  // 옵션 연결
  @OneToMany(
    () => MerchandiseOption,
    (merchandiseOption) => merchandiseOption.merchandisePost,
    { cascade: true },
  )
  merchandiseOption: MerchandiseOption[];

  // 주문 연결
  @OneToMany(() => CartItem, (cartItem) => cartItem.merchandisePost)
  cartItems: CartItem[];
}
