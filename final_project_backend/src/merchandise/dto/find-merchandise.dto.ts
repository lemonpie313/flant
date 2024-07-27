import { IsEnum, IsOptional, IsString } from 'class-validator';

export class FindAllmerchandiseDto {
  /**
   * 검색키워드
   * @example "임영웅"
   */
  @IsOptional()
  @IsString()
  artist?: string;

  /**
   * 카테고리
   * @example "아이돌"
   */
  @IsOptional()
  @IsString()
  category?: string;
}
