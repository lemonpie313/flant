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
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FindAllProductDto } from './dto/find-product.dto';
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
@Controller('v1/products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  /**
   * 상점 생성
   * @param createProductDto
   * @returns
   */
  @ApiBearerAuth()
  @CommunityUserRoles(CommunityUserRole.MANAGER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  async productCreate(
    @UserInfo() user: PartialUser,
    @Body() createProductDto: CreateProductDto,
  ) {
    const data = await this.productService.productCreate(
      createProductDto,
      user,
    );
    return data;
  }

  /**
   * 상점 전체 조회
   * @param findAllProductDto
   * @returns
   */
  @Get()
  async findAll(@Body() findAllProductDto: FindAllProductDto) {
    const data = await this.productService.findAll(findAllProductDto);
    return data;
  }

  /**
   * 상점 상세 조회
   * @param productId
   * @returns
   */
  @Get(':productId')
  findOne(@Param('productId') productId: string) {
    return this.productService.findOne(+productId);
  }

  /**
   * 상점 수정 (작성하였던 매니저만)
   * @param productId
   * @param updateProductDto
   * @returns
   */
  @ApiBearerAuth()
  @Patch(':productId')
  @CommunityUserRoles(CommunityUserRole.MANAGER)
  @UseGuards(JwtAuthGuard, CommunityUserGuard)
  update(
    @Param('productId') productId: string,
    @Body() updateProductDto: UpdateProductDto,
    @UserInfo() user: PartialUser,
  ) {
    return this.productService.update(+productId, updateProductDto, user);
  }

  /**
   * 상품삭제 (작성하였던 매니저만)
   * @param productId
   * @returns
   */
  @ApiBearerAuth()
  @Delete('/:productId')
  @CommunityUserRoles(CommunityUserRole.MANAGER)
  @UseGuards(JwtAuthGuard, CommunityUserGuard)
  remove(@Param('productId') productId: string, @UserInfo() user: PartialUser) {
    return this.productService.remove(+productId, user);
  }
}
