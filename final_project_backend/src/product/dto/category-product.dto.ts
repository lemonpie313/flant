import { PickType } from '@nestjs/swagger';
import { ProductCategory } from '../entities/product.category.entity';

export class ProductCategoryDto extends PickType(ProductCategory, ['name']) {}
