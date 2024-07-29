import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { Product } from './entities/product.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductCategory } from './entities/product.category.entity';
import { OrderModule } from 'src/order/order.module';

@Module({
  imports: [TypeOrmModule.forFeature([Product, ProductCategory]), OrderModule],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
