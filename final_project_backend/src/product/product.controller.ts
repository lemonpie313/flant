import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiTags } from '@nestjs/swagger';
import { FindAllProductDto } from './dto/find-product.dto';

@ApiTags('굿즈 샵 API')
@Controller('v1/products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  /**
   * 상점 생성
   * @param createProductDto
   * @returns
   */
  @Post()
  async productCreate(@Body() createProductDto: CreateProductDto) {
    //매니저 id 받아 전달 + 검사 필요
    const data = await this.productService.productCreate(createProductDto);
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
  @Patch(':productId')
  update(
    @Param('productId') productId: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    //작성 유저도 전달 필요
    return this.productService.update(+productId, updateProductDto);
  }

  /**
   * 상품삭제 (작성하였던 매니저만)
   * @param productId
   * @returns
   */
  @Delete('/:productId')
  remove(@Param('productId') productId: string) {
    //매니저아이디 추가하여 검증 필요
    return this.productService.remove(+productId);
  }
}
