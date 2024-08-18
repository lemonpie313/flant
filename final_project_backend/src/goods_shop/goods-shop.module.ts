import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderModule } from 'src/order/order.module';
import { User } from 'src/user/entities/user.entity';
import { Manager } from 'src/admin/entities/manager.entity';
import { GoodsShopService } from './goods-shop.service';
import { GoodsShopController } from './goods-shop.controller';
import { GoodsShopCategory } from './entities/goods-shop.category.entity';
import { GoodsShop } from './entities/goods-shop.entity';
import { Community } from 'src/community/entities/community.entity';
import { AuthModule } from 'src/auth/auth.module';
import { CommunityUserModule } from 'src/community/community-user/community-user.module';
import { AdminModule } from 'src/admin/admin.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      GoodsShop,
      GoodsShopCategory,
      User,
      Manager,
      Community,
    ]),
    OrderModule,
    CommunityUserModule,
    AdminModule,
  ],
  controllers: [GoodsShopController],
  providers: [GoodsShopService],
})
export class GoodsShopModule {}
