import { PickType } from '@nestjs/swagger';
import { Product } from '../entities/product.entity';
import { ProductCategoryDto } from './category-product.dto';

export class CreateProductDto extends PickType(Product, [
  'productCode',
  'name',
  'detailInfo',
]) {
  categorys: ProductCategoryDto;
}
