import { PickType } from '@nestjs/swagger';
import { Post } from '../entities/post.entity';
import { IsOptional, IsString } from 'class-validator';

export class CreatePostDto extends PickType(Post, [
  'title',
  'content',
  'artistId',
]) {
  /**
   * 게시글에 등록할 이미지 URL
   * @example 'https://www.kasi.re.kr/file/content/20190408102300583_PFFSRTDT.jpg'
   */
  @IsOptional()
  @IsString()
  postImageUrl: string | null;
}
