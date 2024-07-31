import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PostImage } from './post-image.entity';
import { Community } from 'src/community/entities/community.entity';

@Entity()
export class Post {
  @PrimaryGeneratedColumn({ unsigned: true })
  postId: number;

  @Column()
  communityUserId: number;

  @Column()
  communityId: number;

  @IsOptional()
  @IsNumber()
  @Column()
  artistId: number | null;

  /**
   * 게시글 제목
   * @example '오늘의 활동 정리'
   */
  @IsNotEmpty()
  @IsString()
  @Column()
  title: string;

  /**
   * 게시글 내용
   * @example '13:00 음악방송, 15:00 개인방송'
   */
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
  postImages: PostImage[];

  @ManyToOne(() => Community, (community) => community.posts, {
    onDelete: 'CASCADE',
  })
  community: Community;
}
