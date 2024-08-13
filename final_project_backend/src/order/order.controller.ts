import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('order')
@ApiBearerAuth()
@Controller('v1/orders')
@UseGuards(AuthGuard('jwt'))
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  /**
   * 주문 생성
   * @param createOrderDto
   * @returns
   */
  @Post()
  async create(@Req() req) {
    const userId = req.user.id;
    return await this.orderService.create(+userId);
  }

  /**
   * 주문내역 전체 조회
   * @param req
   * @returns
   */
  @Get()
  async findAll(@Req() req) {
    const userId = req.user.id;
    return this.orderService.findAll(userId);
  }

  /**
   * 주문내역 상세조회
   * @param id
   * @returns
   */
  @Get(':id')
  findOne(@Param('id') id: string, @Req() req) {
    const userId = req.user.id;
    return this.orderService.findOne(+id, userId);
  }

  /**
   * 주문 취소 요청
   * @param id
   * @param updateOrderDto
   * @returns
   */
  @Patch(':id')
  update(@Param('id') id: string) {
    return this.orderService.update(+id);
  }
}
