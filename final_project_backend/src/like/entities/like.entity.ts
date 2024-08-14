import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { LikeStatus } from '../types/likeStatus.types';
import { ItemType } from '../types/itemType.types';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { MESSAGES } from 'src/constants/message.constant';
import { Post } from 'src/post/entities/post.entity';
import { Comment } from 'src/comment/entities/comment.entity';

@Entity('like')
export class Like {
  /**
   * 아이템 ID
   * @Example "1"
   */
  @IsNotEmpty({ message: MESSAGES.LIKE.ITEMID.REQUIRED })
  @IsNumber()
  @PrimaryColumn()
  itemId: number;

  /**
   * 유저 ID
   * @Example "1"
   */
  @IsNotEmpty({ message: MESSAGES.LIKE.USERID.REQUIRED })
  @IsNumber()
  @PrimaryColumn()
  userId: number;

  /**
   * 아이템 타입
   * @Example "0"
   */
  @IsNotEmpty({ message: MESSAGES.LIKE.ITEMTYPE.REQUIRED })
  @IsNumber()
  @PrimaryColumn()
  itemType: ItemType;

  /**
   * 좋아요 상태
   * @Example "0"
   */
  @IsNotEmpty({ message: MESSAGES.LIKE.STATUS.REQUIRED })
  @IsNumber()
  @Column()
  status: LikeStatus;

  @ManyToOne(() => Post, (post) => post.likes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'post_id' })
  post: Post;

  @ManyToOne(() => Comment, (comment) => comment.likes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'comment_id' })
  comment: Comment;
}
