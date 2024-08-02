import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { Product } from './entities/product.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductCategory } from './entities/product.category.entity';
import { OrderModule } from 'src/order/order.module';
import { User } from 'src/user/entities/user.entity';
import { Manager } from 'src/admin/entities/manager.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, ProductCategory, User, Manager]),
    OrderModule,
  ],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
