import { PickType } from '@nestjs/swagger';
import { ProductImage } from '../entities/product.image.entity';

export class ProductImageDto extends PickType(ProductImage, ['imageUrl']) {}
