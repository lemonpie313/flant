import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { stat } from 'fs';
import { ProductCategory } from './entities/product.category.entity';
import { Console } from 'console';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductCategory)
    private readonly categoryRepository: Repository<ProductCategory>,
  ) {}

  //상점 생성
  async productCreate(createProductDto: CreateProductDto) {
    const saveProduct = await this.productRepository.save(createProductDto);
    //카테고리 생성 로직 확인 필요

    return {
      status: HttpStatus.CREATED,
      message: '상점 생성에 성공하셨습니다.',
      saveProduct,
    };
  }

  //상점 내 상품 생성
  async productPostCreate(createProductDto: CreateProductDto) {
    const saveProduct = await this.productRepository.save(createProductDto);
    //카테고리 생성 로직 확인 필요

    return {
      status: HttpStatus.CREATED,
      message: '상점 생성에 성공하셨습니다.',
      saveProduct,
    };
  }

  findAll() {
    return `This action returns all product`;
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
