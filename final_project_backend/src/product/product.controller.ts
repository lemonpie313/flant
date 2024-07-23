import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('굿즈 샵 API')
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  /**
   * 굿즈 샵 생성
   * @param createProductDto
   * @returns
   */
  @Post()
  async productCreate(@Body() createProductDto: CreateProductDto) {
    const data = await this.productService.productCreate(createProductDto);
    return data;
  }

  /**
   * 상품 생성
   * @param createProductDto
   * @returns
   */
  @Post()
  async productPostCreate(@Body() createProductDto: CreateProductDto) {
    const data = await this.productService.productPostCreate(createProductDto);
    return data;
  }

  /** */
  @Get()
  findAll() {
    return this.productService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(+id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(+id);
  }
}
