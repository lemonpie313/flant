import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { GoodsShopService } from './goods-shop.service';
import { CreateGoodsShopDto } from './dto/create-goods-shop.dto';
import { UpdateGoodsShopDto } from './dto/update-goods-shop.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FindAllGoodsShopDto } from './dto/find-goods-shop.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/user/types/user-role.type';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('굿즈 샵 API')
@Controller('v1/GoodsShops')
export class GoodsShopController {
  constructor(private readonly goodsShopService: GoodsShopService) {}

  /**
   * 상점 생성
   * @param createGoodsShopDto
   * @returns
   */
  @ApiBearerAuth()
  @Roles(UserRole.Manager)
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard('jwt'))
  @Post()
  async goodsShopCreate(
    @Req() req,
    @Body() createGoodsShopDto: CreateGoodsShopDto,
  ) {
    const userId = req.user.id;
    const data = await this.goodsShopService.goodsShopCreate(
      createGoodsShopDto,
      userId,
    );
    return data;
  }

  /**
   * 상점 전체 조회
   * @param findAllGoodsShopDto
   * @returns
   */
  @Get()
  async findAll(@Query() findAllGoodsShopDto: FindAllGoodsShopDto) {
    const data = await this.goodsShopService.findAll(findAllGoodsShopDto);
    return data;
  }

  /**
   * 상점 상세 조회
   * @param goodsShopId
   * @returns
   */
  @Get(':goodsShopId')
  findOne(@Param('goodsShopId') goodsShopId: string) {
    return this.goodsShopService.findOne(+goodsShopId);
  }

  /**
   * 상점 수정 (작성하였던 매니저만)
   * @param goodsShopId
   * @param updateGoodsShopDto
   * @returns
   */
  @ApiBearerAuth()
  @Patch(':goodsShopId')
  @Roles(UserRole.Manager)
  @UseGuards(AuthGuard('jwt'))
  @UseGuards(RolesGuard)
  update(
    @Param('goodsShopId') goodsShopId: string,
    @Body() updateGoodsShopDto: UpdateGoodsShopDto,
    @Req() req,
  ) {
    const userId = req.user.id;
    return this.goodsShopService.update(
      +goodsShopId,
      updateGoodsShopDto,
      userId,
    );
  }

  /**
   * 상품삭제 (작성하였던 매니저만)
   * @param goodsShopId
   * @returns
   */
  @ApiBearerAuth()
  @Delete('/:goodsShopId')
  @Roles(UserRole.Manager)
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard('jwt'))
  remove(@Param('goodsShopId') goodsShopId: string, @Req() req) {
    const userId = req.user.id;
    return this.goodsShopService.remove(+goodsShopId, userId);
  }
}
