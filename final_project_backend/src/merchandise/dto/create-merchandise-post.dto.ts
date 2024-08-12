import { PickType } from '@nestjs/swagger';

import { MerchandisePost } from '../entities/merchandise-post.entity';

import {
  ArrayNotEmpty,
  IsArray,
  IsInt,
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
  @IsNotEmpty({ message: 'goodsShopId를 입력해주세요' })
  @IsNumber()
  goodsShopId: number;

  /**
   * 이미지 URL
   * @example ["test1.jpg","test2.jpg","test3.jpg"]
   */
  @IsArray({ message: '이미지 URL은 배열로 입력해주세요' })
  @ArrayNotEmpty({ message: '이미지 URL을 입력해주세요 ' })
  @IsString({ each: true, message: '이미지 URL은 문자열이어야 합니다' })
  imageUrl: string[];

  /**
   * 상품 옵션
   * @example ["1번 옵션", "2번 옵션", "3번 옵션"]
   */
  @IsArray({ message: '옵션은 배열로 넣어주세요' })
  @ArrayNotEmpty({ message: '옵션을 입력해주세요 ' })
  @IsString({ each: true, message: '옵션은 문자열이어야 합니다' })
  option: string[];

  /**
   * 상품 옵션별 가격
   * @example [2000,5000,10000]
   */
  @IsArray({ message: '옵션 가격은 배열로 넣어주세요' })
  @ArrayNotEmpty({ message: '옵션 가격은을 입력해주세요 ' })
  @IsInt({ each: true, message: '옵션 가격은 정수여야 합니다' })
  optionPrice: number[];
}
