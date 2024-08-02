import { ApiPropertyOptional, PickType } from '@nestjs/swagger';
import { Post } from '../entities/post.entity';
import { IsOptional, IsString } from 'class-validator';

export class CreatePostDto extends PickType(Post, [
  'title',
  'content',
]) {}
