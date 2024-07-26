import { IsNotEmpty, IsString } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PostImage } from './post-image.entity';

@Entity()
export class Post {
  @PrimaryGeneratedColumn({ unsigned: true })
  postId: number;

  @Column()
  communityUserId: number;

  @Column()
  communityId: number;

  @Column()
  artistId?: number | null;

  @IsNotEmpty()
  @IsString()
  @Column()
  title: string;

  @IsNotEmpty()
  @IsString()
  @Column()
  content: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @OneToMany(() => PostImage, (postImage) => postImage.post)
  postImages: PostImage;
}
