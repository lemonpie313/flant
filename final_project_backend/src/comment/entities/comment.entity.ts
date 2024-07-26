import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUrl } from 'class-validator';
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

@Entity('comments')
export class Comment {
  @PrimaryGeneratedColumn({ unsigned: true })
  commentId: number;

  @IsNotEmpty()
  @IsNumber()
  @Column({ unsigned: true })
  postId: number;

  @IsNotEmpty()
  @IsNumber()
  @Column({ unsigned: true })
  communityUserId: number;

  @IsOptional()
  @IsNumber()
  @Column({ unsigned: true, nullable: true })
  artistId: number | null;

  @IsNotEmpty()
  @IsString()
  @Column('text')
  comment: string;

  @IsOptional()
  @IsUrl()
  @Column({ nullable: true })
  imageUrl: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;

  @IsOptional()
  @IsNumber()
  @Column({ unsigned: true, nullable: true })
  parentCommentId: number | null;

  @ManyToOne(() => Comment, (comment) => comment.childComments, { nullable: true })
  parentComment: Comment;

  @OneToMany(() => Comment, (comment) => comment.parentComment)
  childComments: Comment[];
}
