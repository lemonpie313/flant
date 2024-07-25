import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUrl } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('comments')  // 'comments' 테이블과 매핑되는 엔티티임을 명시
export class Comment {
  @PrimaryGeneratedColumn({ unsigned: true })
  // 댓글 ID, 자동 생성되는 기본 키
  commentId: number;

  @IsNotEmpty()
  @IsNumber()
  @Column({ unsigned: true })
  // 댓글이 달린 포스트의 ID
  postId: number;

  @IsNotEmpty()
  @IsNumber()
  @Column({ unsigned: true })
  // 댓글을 작성한 커뮤니티 유저의 ID
  communityUserId: number;

  @IsOptional()
  @IsNumber()
  @Column({ unsigned: true, nullable: true })
  // 댓글을 작성한 아티스트의 ID (null 가능)
  artistId: number | null;

  @IsNotEmpty()
  @IsString()
  @Column('text')
  // 댓글 내용
  comment: string;

  @IsOptional()
  @IsUrl()
  @Column({ nullable: true })
  // 이미지 URL (null 가능)
  imageUrl: string | null;

  @CreateDateColumn()
  // 생성 일시
  createdAt: Date;

  @UpdateDateColumn()
  // 수정 일시
  updatedAt: Date;

  @DeleteDateColumn()
  // 삭제 일시 (null 가능)
  deletedAt: Date | null;
}
