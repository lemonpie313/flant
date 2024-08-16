import {
  ArrayNotEmpty,
  IsArray,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateMerchandiseDto {
  /**
   * 제목
   * @example "수정 제목"
   */
  @IsOptional()
  @IsString()
  title?: string;

  /**
   * 썸네일
   * @example "수정 썸네일"
   */
  @IsOptional()
  @IsString()
  thumbnail?: string;

  /**
   * 내용
   * @example "수정 내용"
   */
  @IsOptional()
  @IsString()
  content?: string;

  /**
   * 배송비
   * @example 3000
   */
  @IsOptional()
  @IsNumber()
  deliveryPrice?: number;

  /**
   * 이미지
   * @example ["test1.jpg","test2.jpg","test3.jpg"]
   */
  @IsOptional()
  @IsArray({ message: '이미지 URL은 배열로 입력해주세요' })
  @IsString({ each: true, message: '이미지 URL은 문자열이어야 합니다' })
  imageUrl?: string[];

  /**
   * 옵션명
   * @example ["1번 옵션", "2번 옵션", "3번 옵션"]
   */
  @IsOptional()
  @IsArray({ message: '옵션은 배열로 넣어주세요' })
  @IsString({ each: true, message: '옵션은 문자열이어야 합니다' })
  optionName?: string[];

  /**
   * 옵션 가격
   * @example [2000,5000,10000]
   */
  @IsOptional()
  @IsArray({ message: '옵션 가격은 배열로 넣어주세요' })
  @IsInt({ each: true, message: '옵션 가격은 정수여야 합니다' })
  optionPrice?: number[];
}
