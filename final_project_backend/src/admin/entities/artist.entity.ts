import { IsInt, IsNotEmpty, IsString, Validate } from 'class-validator';
import { Comment } from '../../comment/entities/comment.entity';

import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MESSAGES } from 'src/constants/message.constant';
import { IsNotEmptyConstraint } from 'src/util/decorators/is-not-emtpy-constraint.decorator';

@Entity('artists')
export class Artist {
  @PrimaryGeneratedColumn()
  artistId: number;
  /**
   * 그룹 ID
   * @example 1
   */
  @IsNotEmpty({ message: MESSAGES.COMMUNITY.COMMON.COMMUNITYID.REQUIRED })
  @IsInt()
  @Column()
  communityId: number;
  /**
   * 회원 ID
   * @example 1
   */
  @IsNotEmpty({ message: MESSAGES.USER.COMMON.USERID.REQUIRED })
  @IsInt()
  @Column()
  userId: number;

  /**
   * 아티스트 닉네임
   * @example "츄 닉네임"
   */
  @IsNotEmpty({ message: MESSAGES.ARTIST.COMMON.NICKNAME.REQUIRED })
  @Validate(IsNotEmptyConstraint)
  @IsString()
  @Column()
  artistNickname: string;

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @OneToMany(() => Comment, (comment) => comment.artist)
  comments: Comment[]; // 아티스트와 댓글 관계
}
