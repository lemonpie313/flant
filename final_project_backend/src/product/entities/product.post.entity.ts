import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Product } from './product.entity';
import { ProductImage } from './product.image.entity';
import { Order } from 'src/order/entities/order.entity';
import { Option } from './option.entity';
import { CartItem } from 'src/order/entities/cart.item.entity';

@Entity('product_posts')
export class ProductPost {
  @PrimaryGeneratedColumn({ unsigned: true })
  @Column()
  goodsId: number;

  /**
   * 제목
   * @example "제목"
   */
  @IsNotEmpty({ message: '제목을 입력해주세요' })
  @IsString()
  @Column()
  title: string;

  /**
   * 썸네일
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
  productSalesName: string;

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
  @ManyToOne(() => Product, (product) => product.productPost)
  product: Product[];

  // 상품 이미지 연결
  @OneToMany(() => ProductImage, (productImage) => productImage.productPost)
  productImage: ProductImage[];

  // 주문 연결
  @OneToMany(() => CartItem, (cartItem) => cartItem.productPost)
  cartItem: CartItem[];

  // 옵션 연결
  @OneToMany(() => Option, (option) => option.productPost)
  option: Option[];
}
