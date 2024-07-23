import { Module } from '@nestjs/common';
import { MerchandiseService } from './merchandise.service';
import { MerchandiseController } from './merchandise.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MerchandiseImage } from './entities/merchandise-image.entity';
import { MerchandiseOption } from './entities/marchandise-option.entity';
import { MerchandisePost } from './entities/merchandise-post.entity';
import { Product } from 'src/product/entities/product.entity';
import { Order } from 'src/order/entities/order.entity';
import { OrderModule } from 'src/order/order.module';
import { ProductModule } from 'src/product/product.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MerchandiseImage,
      MerchandiseOption,
      MerchandisePost,
      Product,
    ]),
  ],
  controllers: [MerchandiseController],
  providers: [MerchandiseService],
})
export class MerchandiseModule {}
