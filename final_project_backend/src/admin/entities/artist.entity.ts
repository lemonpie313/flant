import { IsInt, IsNotEmpty, IsString, Validate } from 'class-validator';
import { Comment } from '../../comment/entities/comment.entity';

import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MESSAGES } from 'src/constants/message.constant';
import { IsNotEmptyConstraint } from 'src/util/decorators/is-not-emtpy-constraint.decorator';
import { CommunityUser } from './../../community/community-user/entities/communityUser.entity';
import { Community } from 'src/community/entities/community.entity';
import { Post } from 'src/post/entities/post.entity';

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
  communityUserId: number;

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

  @OneToOne(() => CommunityUser, (communityuser) => communityuser.artist)
  communityUser: CommunityUser; // 아티스트와 댓글 관계

  @ManyToOne(() => Community, (community) => community.artist)
  community: Community;

  @OneToMany(() => Post, (post) => post.artist)
  posts: Post[];
}
