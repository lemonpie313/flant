import { PickType } from '@nestjs/swagger';
import { Product } from '../entities/product.entity';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto extends PickType(Product, [
  'productCode',
  'name',
  'detailInfo',
]) {
  /**
   * 카테고리명
   * @example "카테고리 선택"
   */
  @IsNotEmpty({ message: '카테고리명을 입력해주세요' })
  @IsString()
  categoryname: string;
}
