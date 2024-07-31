import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from '../cart/entities/cart.entity';
import { CartItem } from '../cart/entities/cart.item.entity';
import { Order } from './entities/order.entity';
import { MerchandiseModule } from 'src/merchandise/merchandise.module';
import { ProductModule } from 'src/product/product.module';
import { User } from 'src/user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cart, CartItem, Order, User])],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
