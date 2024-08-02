import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

export class CreateCommentDto {
  @IsNotEmpty()
  @IsNumber()
  postId: number;

  @IsNotEmpty()
  @IsNumber()
  communityUserId: number;

  @IsOptional()
  @IsNumber()
  artistId: number | null;

  @IsNotEmpty()
  @IsString()
  comment: string;

  @IsOptional()
  @IsUrl()
  imageUrl: string | null;
}
