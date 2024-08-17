import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { Product } from './entities/product.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductCategory } from './entities/product.category.entity';
import { OrderModule } from 'src/order/order.module';
import { User } from 'src/user/entities/user.entity';
import { Manager } from 'src/admin/entities/manager.entity';
import { AuthModule } from 'src/auth/auth.module';
import { CommunityUserModule } from 'src/community/community-user/community-user.module';
import { AdminModule } from 'src/admin/admin.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, ProductCategory, User, Manager]),
    OrderModule,
    CommunityUserModule,
    AdminModule,
  ],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
