import { Module } from '@nestjs/common';
import { MerchandiseService } from './merchandise.service';
import { MerchandiseController } from './merchandise.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MerchandiseImage } from './entities/merchandise-image.entity';
import { MerchandiseOption } from './entities/marchandise-option.entity';
import { MerchandisePost } from './entities/merchandise-post.entity';

import { Manager } from 'src/admin/entities/manager.entity';
import { User } from 'src/user/entities/user.entity';
import { GoodsShop } from 'src/goods_shop/entities/goods-shop.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MerchandiseImage,
      MerchandiseOption,
      MerchandisePost,
      GoodsShop,
      Manager,
      User,
    ]),
  ],
  controllers: [MerchandiseController],
  providers: [MerchandiseService],
})
export class MerchandiseModule {}
