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
import { GoodsShopCategory } from './goods-shop.category.entity';
import { MerchandiseImage } from 'src/merchandise/entities/merchandise-image.entity';
import { MerchandisePost } from '../../merchandise/entities/merchandise-post.entity';
import { Manager } from 'src/admin/entities/manager.entity';
import { Community } from 'src/community/entities/community.entity';

@Entity('goods_shop')
export class GoodsShop {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @Column()
  goodsShopCode: string;

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

  //매니저 연결
  @ManyToOne(() => Manager, (manager) => manager.goodsShop, {
    onDelete: 'CASCADE',
  })
  manager: Manager;

  //커뮤니티 연결
  @ManyToOne(() => Community, (community) => community.goodsShop, {
    onDelete: 'CASCADE',
  })
  community: Community;

  //상품 게시물 연결
  @OneToMany(
    () => MerchandisePost,
    (merchandisePost) => merchandisePost.goodsShop,
    {
      cascade: true,
    },
  )
  merchandisePost: MerchandisePost[];

  //카테고리 연결

  @OneToMany(
    () => GoodsShopCategory,
    (goodsShopCategory) => goodsShopCategory.goodsShop,
    {
      cascade: true,
    },
  )
  goodsShopCategory: GoodsShopCategory[];
}
