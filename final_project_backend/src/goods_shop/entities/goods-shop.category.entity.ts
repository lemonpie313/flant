import { IsNotEmpty, IsString } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { GoodsShop } from './goods-shop.entity';

@Entity('goods_shop_categorys')
export class GoodsShopCategory {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

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
  @ManyToOne(() => GoodsShop, (GoodsShop) => GoodsShop.goodsShopCategory, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'goodsShop_id' })
  goodsShop: GoodsShop;
}
