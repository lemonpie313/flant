import {
  ForbiddenException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Like, Repository } from 'typeorm';
import { stat } from 'fs';
import { ProductCategory } from './entities/product.category.entity';
import { Console } from 'console';
import { FindAllProductDto } from './dto/find-product.dto';
import { Manager } from 'src/admin/entities/manager.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductCategory)
    private readonly categoryRepository: Repository<ProductCategory>,
    @InjectRepository(Manager)
    private readonly managerRepository: Repository<Manager>,
  ) {}

  //상점 생성
  async productCreate(
    createProductDto: CreateProductDto,
    communityUserId: number,
  ) {
    const { artist, categoryName, detailInfo, name, productCode } =
      createProductDto;

    //매니저 정보 가져오기
    const manager = await this.managerRepository.findOne({
      where: { communityUserId },
    });

    // 상점 생성
    const saveProduct = await this.productRepository.save({
      artist,
      name,
      productCode,
      detailInfo,
      manager,
    });

    const saveCategory = await this.categoryRepository.save({
      name: categoryName,
      product: saveProduct,
    });

    return {
      status: HttpStatus.CREATED,
      message: '상점 생성에 성공하셨습니다.',
      data: {
        shopId: saveProduct.id,
        //매니저 아이디 추가
        name: saveProduct.name,
        artist: saveProduct.artist,
        productCode: saveProduct.productCode,
        detailInfo: saveProduct.detailInfo,
        categoryName: saveCategory.name,
        createdAt: saveProduct.createdAt,
        updatedAt: saveProduct.updatedAt,
      },
    };
  }

  async findAll(findAllProductDto: FindAllProductDto) {
    const { name, artist } = findAllProductDto;

    let product;

    if (!name && !artist) {
      product = await this.productRepository.find({
        relations: ['productCategory'],
      });
    } else if (name && artist) {
      product = await this.productRepository.find({
        where: [{ name: Like(`%${name}%`), artist: Like(`%${artist}%`) }],
        relations: ['productCategory'],
      });
    } else if (artist) {
      product = await this.productRepository.find({
        where: { artist: Like(`%${artist}%`) },
        relations: ['productCategory'],
      });
    } else if (name) {
      product = await this.productRepository.find({
        where: { name: Like(`%${name}%`) },
        relations: ['productCategory'],
      });
    }

    const data = product.map((products) => ({
      id: products.id,
      name: products.name,
      artist: products.artist,
      category: products.productCategory,
      // 카테고리 이름만 가져오는 방법은 없을까?
      productCode: products.productCode,
      detailInfo: products.detailInfo,
      createdAt: products.createdAt,
      updatedAt: products.updatedAt,
    }));

    return {
      status: HttpStatus.OK,
      message: `상점명 : ${name} / 아티스트 : ${artist} 상품 전체 조회가 완료되었습니다`,
      data,
    };
  }

  async findOne(productId: number) {
    // 상품 유효 체크
    const product = await this.productRepository.findOne({
      where: { id: productId },
      relations: ['productCategory'],
    });

    if (!product) {
      throw new NotFoundException('존재하지 않는 상점입니다.');
    }

    return {
      status: HttpStatus.OK,
      message: '상점 상세 조회에 성공하였습니다.',
      data: {
        shopId: product.id,
        //매니저 아이디 추가
        name: product.name,
        artist: product.artist,
        productCode: product.productCode,
        detailInfo: product.detailInfo,
        categoryName: product.productCategory[0].name,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
      },
    };
  }

  //상점 수정
  async update(
    id: number,
    updateProductDto: UpdateProductDto,
    communityUserId: number,
  ) {
    const { name, artist, productCode, detailInfo, categoryName } =
      updateProductDto;

    //상점 유효성 체크
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['productCategory', 'manager'],
    });
    if (!product) {
      throw new NotFoundException('존재하지 않는 상점입니다.');
    }

    // product 작성자와 수정 요청한 사용자가 일치한지 확인
    if (product.manager.communityUserId !== communityUserId) {
      throw new ForbiddenException('수정 권한이 없습니다.');
    }

    if (name !== undefined) {
      product.name = name;
    }
    if (artist !== undefined) {
      product.artist = artist;
    }
    if (productCode !== undefined) {
      product.productCode = productCode;
    }
    if (detailInfo !== undefined) {
      product.detailInfo = detailInfo;
    }
    if (categoryName !== undefined) {
      product.productCategory[0].name = categoryName;
    }

    await this.productRepository.save(product);

    return {
      status: HttpStatus.OK,
      message: '수정 완료되었습니다.',
      product,
    };
  }

  async remove(id: number, communityUserId: number) {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['productCategory', 'manager'],
    });
    if (!product) {
      throw new NotFoundException('존재하지 않는 상점입니다.');
    }
    console.log(product);
    // product 작성자와 수정 요청한 사용자가 일치한지 확인
    if (product.manager.communityUserId !== communityUserId) {
      throw new ForbiddenException('수정 권한이 없습니다.');
    }

    await this.categoryRepository.delete({
      product: { id }, //
    });

    await this.productRepository.delete(id);

    return {
      status: HttpStatus.OK,
      message: '상품 삭제에 성공하였습니다.',
      data: { id },
    };
  }
}
