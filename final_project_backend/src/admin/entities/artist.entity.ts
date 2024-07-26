import { IsInt, IsNotEmpty, IsString } from 'class-validator';

import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Comment } from '../../comment/entities/comment.entity'; 

@Entity('artists')
export class Artist {
  @PrimaryGeneratedColumn()
  artistId: number;
  /**
   * 그룹 ID
   * @example 1
   */
  @IsNotEmpty({ message: `그룹 ID를 입력해 주세요.` })
  @IsInt()
  @Column()
  communityId: number;
  /**
   * 회원 ID
   * @example 1
   */
  @IsNotEmpty({ message: `유저 ID를 입력해 주세요.` })
  @IsInt()
  @Column()
  userId: number;

  /**
   * 아티스트 닉네임
   * @example "츄 닉네임"
   */
  @IsNotEmpty({ message: `닉네임을 입력해 주세요.` })
  @IsString()
  @Column()
  artistNickname: string;

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @OneToMany(() => Comment, (comment) => comment.artist)
  comments: Comment[];  // 아티스트와 댓글 관계
}
