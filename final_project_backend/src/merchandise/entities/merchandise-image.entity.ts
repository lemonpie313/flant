import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { IsArray, IsNotEmpty, IsString } from 'class-validator';
import { Product } from 'src/product/entities/product.entity';
import { MerchandisePost } from './merchandise-post.entity';

@Entity('merchandise_image')
export class MerchandiseImage {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @Column()
  url: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // 상품게시물 연결
  @ManyToOne(
    () => MerchandisePost,
    (merchandisePost) => merchandisePost.merchandiseImage,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'merchandisePost_id' })
  merchandisePost: MerchandisePost;
}
