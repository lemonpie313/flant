import { IsNotEmpty, IsString } from 'class-validator';

export class CreateGoodsShopDto {
  /**
   * 상점 코드
   * @example "ABCDEFGHI11"
   */
  @IsNotEmpty({ message: '상점 코드를 입력해주세요' })
  @IsString()
  goodsShopCode: string;

  /**
   * 상점명
   * @example "상점명"
   */
  @IsNotEmpty({ message: '상품명을 입력해주세요' })
  @IsString()
  name: string;

  /**
   * 상세정보
   * @example "이 상점의 정보를 입력해주세요 "
   */
  @IsNotEmpty({ message: '상세정보를 입력해주세요' })
  @IsString()
  detailInfo: string;

  /**
   * 아티스트
   * @example "아티스트를 입력해주세요"
   */
  @IsNotEmpty({ message: '아티스트를 입력해주세요' })
  @IsString()
  artist: string;

  /**
   * 카테고리명
   * @example "카테고리 선택"
   */
  @IsNotEmpty({ message: '카테고리명을 입력해주세요' })
  @IsString()
  categoryName: string;
}
