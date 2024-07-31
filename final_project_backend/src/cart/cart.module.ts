import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { User } from 'src/user/entities/user.entity';
import { CartItem } from './entities/cart.item.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { MerchandisePost } from 'src/merchandise/entities/merchandise-post.entity';
import { MerchandiseOption } from 'src/merchandise/entities/marchandise-option.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Cart,
      CartItem,
      User,
      MerchandisePost,
      MerchandiseOption,
    ]),
  ],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}
