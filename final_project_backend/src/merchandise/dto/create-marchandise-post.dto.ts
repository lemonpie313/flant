import { PickType } from '@nestjs/swagger';

import { MerchandisePost } from '../entities/merchandise-post.entity';
import { MerchandiseOptionDto } from './option-product.dto';
import { MerchandiseImageDto } from './marchandise-image.dto';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateMerchandiseDto extends PickType(MerchandisePost, [
  'title',
  'thumbnail',
  'salesName',
  'content',
  'deliveryPrice',
]) {
  @IsNotEmpty({ message: 'productId를 입력해주세요' })
  @IsNumber()
  productId: number;

  /**
   * 이미지 URL
   * @example "abcdf.jpg"
   */
  @IsNotEmpty({ message: '이미지 URL을 입력해주세요' })
  @IsString()
  imageUrl: string;

  // @ValidateNested()
  // @Type(() => MerchandiseImageDto)
  // merchandiseImage: MerchandiseImageDto[];

  @ValidateNested()
  @Type(() => MerchandiseOptionDto)
  merchandiseOptionDto: MerchandiseOptionDto[];
}
