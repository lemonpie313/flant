import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
  Query,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('카트 API')
@ApiBearerAuth()
@Controller('v1/cart')
@UseGuards(AuthGuard('jwt'))
export class CartController {
  constructor(private readonly cartService: CartService) {}

  /**
   * 카트 생성
   * @param createCartDto
   * @param req
   * @returns
   */
  @Post()
  async create(@Body() createCartDto: CreateCartDto, @Req() req) {
    const userId = req.user.id;

    return await this.cartService.create(createCartDto, userId);
  }

  /**
   *
   * @returns 카트 전체 조회
   */
  @Get()
  async findAll(@Req() req) {
    const userId = req.user.id;
    return await this.cartService.findAll(userId);
  }

  /**
   * 카트 item 삭제
   * @param cartItemId
   * @returns
   */
  @Delete()
  remove(@Query('cartItemId') cartItemId: string, @Req() req) {
    const userId = req.user.id;
    return this.cartService.remove(+cartItemId, userId);
  }
}
