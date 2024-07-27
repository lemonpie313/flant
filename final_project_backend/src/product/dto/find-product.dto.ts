import { IsEnum, IsOptional, IsString } from 'class-validator';

export class FindAllProductDto {
  /**
   * 검색상점명
   * @example "상점명"
   */
  @IsOptional()
  @IsString()
  name?: string;

  /**
   * 검색 아티스트명
   * @example "아티스트명"
   */
  @IsOptional()
  @IsString()
  artist?: string;
}
