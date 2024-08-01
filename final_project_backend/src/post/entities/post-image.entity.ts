import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Post } from './post.entity';
import { IsOptional } from 'class-validator';

@Entity('post_images')
export class PostImage {
  @PrimaryGeneratedColumn({ unsigned: true })
  postImageId: number;

  @Column()
  postId: number;

  @IsOptional()
  @Column()
  postImageUrl: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Post, (post) => post.postImages, { onDelete: 'CASCADE' })
  post: Post;
}
