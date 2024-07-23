import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateMerchandiseDto } from './dto/create-marchandise-post.dto';
import { MerchandisePost } from './entities/merchandise-post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MerchandiseImage } from './entities/merchandise-image.entity';
import { Product } from 'src/product/entities/product.entity';
import { NotFoundError } from 'rxjs';

@Injectable()
export class MerchandiseService {
  constructor(
    @InjectRepository(MerchandisePost)
    private readonly merchandiseRepository: Repository<MerchandisePost>,
    @InjectRepository(MerchandiseImage)
    private readonly merchandiseImageRepository: Repository<MerchandiseImage>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(createMerchandiseDto: CreateMerchandiseDto) {
    const { merchandiseOptionDto, productId, imageUrl, ...merchandiseData } =
      createMerchandiseDto;

    const product = await this.productRepository.findOne({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('상품이 존재하지 않습니다');
    }

    // MerchandisePost 생성 시 productId를 사용하여 관계 설정
    const merchandise = await this.merchandiseRepository.create({
      ...merchandiseData,
      product, // product를 할당
    });
    const savedMerchandise = await this.merchandiseRepository.save(merchandise);
    return {
      status: HttpStatus.CREATED,
      message: '상품 생성이 완료되었습니다',
      savedMerchandise,
    };
  }

  findAll() {
    return `This action returns all merchandise`;
  }

  findOne(id: number) {
    return `This action returns a #${id} merchandise`;
  }

  remove(id: number) {
    return `This action removes a #${id} merchandise`;
  }
}
