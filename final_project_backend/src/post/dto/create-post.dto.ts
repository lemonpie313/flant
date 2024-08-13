import { PickType } from '@nestjs/swagger';
import { Post } from '../entities/post.entity';

export class CreatePostDto extends PickType(Post, [
  'title',
  'content',
]) {
  /**
   * 작성할 커뮤니티 ID
   * @example 1
   */
  communityId: number;
}
