import { IsOptional, IsString } from 'class-validator';

export class UpdateGoodsShopDto {
  /**
   * 수정 상점명
   * @example "수정 상점명"
   */
  @IsOptional()
  @IsString()
  name?: string;

  /**
   * 수정 아티스트명
   * @example "수정 아티스트명"
   */
  @IsOptional()
  @IsString()
  artist?: string;

  /**
   * 수정 상품 코드
   * @example "수정 판매 코드"
   */
  @IsOptional()
  @IsString()
  goodsShopCode?: string;

  /**
   * 수정 내용
   * @example "수정 내용"
   */
  @IsOptional()
  @IsString()
  detailInfo?: string;

  /**
   * 수정 카테고리
   * @example "수정 카테고리"
   */
  @IsOptional()
  @IsString()
  categoryName?: string;
}
