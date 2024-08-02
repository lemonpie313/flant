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
  @Roles(UserRole.Manager)
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard('jwt'))
  @Post()
  async productCreate(@Req() req, @Body() createProductDto: CreateProductDto) {
    const userId = req.user.id;
    const data = await this.productService.productCreate(
      createProductDto,
      userId,
    );
    return data;
  }

  /**
   * 상점 전체 조회
   * @param findAllProductDto
   * @returns
   */
  @Get()
  async findAll(@Query() findAllProductDto: FindAllProductDto) {
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
  @Roles(UserRole.Manager)
  @UseGuards(AuthGuard('jwt'))
  @UseGuards(RolesGuard)
  update(
    @Param('productId') productId: string,
    @Body() updateProductDto: UpdateProductDto,
    @Req() req,
  ) {
    const userId = req.user.id;
    return this.productService.update(+productId, updateProductDto, userId);
  }

  /**
   * 상품삭제 (작성하였던 매니저만)
   * @param productId
   * @returns
   */
  @ApiBearerAuth()
  @Delete('/:productId')
  @Roles(UserRole.Manager)
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard('jwt'))
  remove(@Param('productId') productId: string, @Req() req) {
    const userId = req.user.id;
    return this.productService.remove(+productId, userId);
  }
}
