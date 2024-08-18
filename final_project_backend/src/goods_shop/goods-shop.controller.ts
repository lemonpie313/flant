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
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PartialUser } from 'src/user/interfaces/partial-user.entity';
import { UserInfo } from 'src/util/decorators/user-info.decorator';
import { CommunityUserRole } from 'src/community/community-user/types/community-user-role.type';
import { CommunityUserRoles } from 'src/auth/decorators/community-user-roles.decorator';
import { CommunityUserGuard } from 'src/auth/guards/community-user.guard';

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
  @CommunityUserRoles(CommunityUserRole.MANAGER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  async goodsShopCreate(
    @UserInfo() user: PartialUser,
    @Body() createGoodsShopDto: CreateGoodsShopDto,
  ) {
    const data = await this.goodsShopService.goodsShopCreate(
      createGoodsShopDto,
      user,
    );
    return data;
  }

  /**
   * 상점 전체 조회
   * @param findAllGoodsShopDto
   * @returns
   */
  @Get()
  async findAll(@Body() findAllGoodsShopDto: FindAllGoodsShopDto) {
    const data = await this.goodsShopService.findAll(findAllGoodsShopDto);
    return data;
  }

  /**
   * 상점 상세 조회
   * @param goodsShopId
   * @returns
   */
  @Get(':goodsShopId')
  async findOne(@Param('goodsShopId') goodsShopId: string) {
    return await this.goodsShopService.findOne(+goodsShopId);
  }

  /**
   * 상점 수정 (작성하였던 매니저만)
   * @param goodsShopId
   * @param updateGoodsShopDto
   * @returns
   */
  @ApiBearerAuth()
  @Patch(':goodsShopId')
  @CommunityUserRoles(CommunityUserRole.MANAGER)
  @UseGuards(JwtAuthGuard, CommunityUserGuard)
  async update(
    @Param('goodsShopId') goodsShopId: string,
    @Body() updateGoodsShopDto: UpdateGoodsShopDto,
    @UserInfo() user: PartialUser,
  ) {
    return await this.goodsShopService.update(
      +goodsShopId,
      updateGoodsShopDto,
      user,
    );
  }

  /**
   * 상품삭제 (작성하였던 매니저만)
   * @param goodsShopId
   * @returns
   */
  @ApiBearerAuth()
  @Delete('/:goodsShopId')
  @CommunityUserRoles(CommunityUserRole.MANAGER)
  @UseGuards(JwtAuthGuard, CommunityUserGuard)
  async remove(
    @Param('goodsShopId') goodsShopId: string,
    @UserInfo() user: PartialUser,
  ) {
    return await this.goodsShopService.remove(+goodsShopId, user);
  }
}
