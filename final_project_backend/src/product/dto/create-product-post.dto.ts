import { PickType } from '@nestjs/swagger';

import { ProductPost } from '../entities/product.post.entity';
import { ProductImageDto } from './image-product.dto';
import { OptionDto } from './option-product.dto';

export class ProductPostDto extends PickType(ProductPost, [
  'title',
  'thumbnail',
  'productSalesName',
  'content',
  'deliveryPrice',
]) {
  productImage: ProductImageDto;
  option: OptionDto;
}
