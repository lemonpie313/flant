import {
  ForbiddenException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { GoodsShop } from './entities/goods-shop.entity';
import { Like, Repository } from 'typeorm';
import { Manager } from 'src/admin/entities/manager.entity';
import { GoodsShopCategory } from './entities/goods-shop.category.entity';
import { CreateGoodsShopDto } from './dto/create-goods-shop.dto';
import { FindAllGoodsShopDto } from './dto/find-goods-shop.dto';
import { UpdateGoodsShopDto } from './dto/update-goods-shop.dto';

@Injectable()
export class GoodsShopService {
  constructor(
    @InjectRepository(GoodsShop)
    private readonly goodsShopRepository: Repository<GoodsShop>,
    @InjectRepository(GoodsShopCategory)
    private readonly goodsShopCategoryRepository: Repository<GoodsShopCategory>,
    @InjectRepository(Manager)
    private readonly managerRepository: Repository<Manager>,
  ) {}

  //상점 생성
  async goodsShopCreate(
    createGoodsShopDto: CreateGoodsShopDto,
    userId: number,
  ) {
    const { artist, categoryName, detailInfo, name, goodsShopCode } =
      createGoodsShopDto;

    //매니저 정보 가져오기
    const manager = await this.managerRepository.findOne({
      where: { userId },
    });

    // 상점 생성
    const saveGoodsShop = await this.goodsShopRepository.save({
      artist,
      name,
      goodsShopCode,
      detailInfo,
      manager,
    });

    const saveCategory = await this.goodsShopCategoryRepository.save({
      name: categoryName,
      GoodsShop: saveGoodsShop,
    });

    return {
      status: HttpStatus.CREATED,
      message: '상점 생성에 성공하셨습니다.',
      data: {
        shopId: saveGoodsShop.id,
        //매니저 아이디 추가
        name: saveGoodsShop.name,
        artist: saveGoodsShop.artist,
        goodsShopCode: saveGoodsShop.goodsShopCode,
        detailInfo: saveGoodsShop.detailInfo,
        categoryName: saveCategory.name,
        createdAt: saveGoodsShop.createdAt,
        updatedAt: saveGoodsShop.updatedAt,
      },
    };
  }

  async findAll(findAllGoodsShopDto: FindAllGoodsShopDto) {
    const { name, artist } = findAllGoodsShopDto;

    let goodsShop;

    if (!name && !artist) {
      goodsShop = await this.goodsShopRepository.find({
        relations: ['goodsShopCategory'],
      });
    } else if (name && artist) {
      goodsShop = await this.goodsShopRepository.find({
        where: [{ name: Like(`%${name}%`), artist: Like(`%${artist}%`) }],
        relations: ['goodsShopCategory'],
      });
    } else if (artist) {
      goodsShop = await this.goodsShopRepository.find({
        where: { artist: Like(`%${artist}%`) },
        relations: ['goodsShopCategory'],
      });
    } else if (name) {
      goodsShop = await this.goodsShopRepository.find({
        where: { name: Like(`%${name}%`) },
        relations: ['goodsShopCategory'],
      });
    }

    const data = goodsShop.map((goodsShops) => ({
      id: goodsShops.id,
      name: goodsShops.name,
      artist: goodsShops.artist,
      category: goodsShops.goodsShopCategory,
      // 카테고리 이름만 가져오는 방법은 없을까?
      GoodsShopCode: goodsShops.GoodsShopCode,
      detailInfo: goodsShops.detailInfo,
      createdAt: goodsShops.createdAt,
      updatedAt: goodsShops.updatedAt,
    }));

    return {
      status: HttpStatus.OK,
      message: `상점명 : ${name} / 아티스트 : ${artist} 상품 전체 조회가 완료되었습니다`,
      data,
    };
  }

  async findOne(goodsShopId: number) {
    // 상품 유효 체크
    const goodsShop = await this.goodsShopRepository.findOne({
      where: { id: goodsShopId },
      relations: ['goodsShopCategory'],
    });

    if (!goodsShop) {
      throw new NotFoundException('존재하지 않는 상점입니다.');
    }

    return {
      status: HttpStatus.OK,
      message: '상점 상세 조회에 성공하였습니다.',
      data: {
        shopId: goodsShop.id,
        //매니저 아이디 추가xx > 커뮤니티 ID
        name: goodsShop.name,
        artist: goodsShop.artist,
        GoodsShopCode: goodsShop.goodsShopCode,
        detailInfo: goodsShop.detailInfo,
        categoryName: goodsShop.goodsShopCategory[0].name,
        createdAt: goodsShop.createdAt,
        updatedAt: goodsShop.updatedAt,
      },
    };
  }

  //상점 수정
  async update(
    id: number,
    updateGoodsShopDto: UpdateGoodsShopDto,
    userId: number,
  ) {
    const { name, artist, goodsShopCode, detailInfo, categoryName } =
      updateGoodsShopDto;

    //상점 유효성 체크
    const goodsShop = await this.goodsShopRepository.findOne({
      where: { id },
      relations: ['goodsShopCategory', 'manager'],
    });
    if (!goodsShop) {
      throw new NotFoundException('존재하지 않는 상점입니다.');
    }

    // GoodsShop 작성자와 수정 요청한 사용자가 일치한지 확인
    if (goodsShop.manager.userId !== userId) {
      throw new ForbiddenException('수정 권한이 없습니다.');
    }

    if (name !== undefined) {
      goodsShop.name = name;
    }
    if (artist !== undefined) {
      goodsShop.artist = artist;
    }
    if (goodsShopCode !== undefined) {
      goodsShop.goodsShopCode = goodsShopCode;
    }
    if (detailInfo !== undefined) {
      goodsShop.detailInfo = detailInfo;
    }
    if (categoryName !== undefined) {
      goodsShop.goodsShopCategory[0].name = categoryName;
    }

    await this.goodsShopRepository.save(goodsShop);

    return {
      status: HttpStatus.OK,
      message: '수정 완료되었습니다.',
      goodsShop,
    };
  }

  async remove(id: number, userId: number) {
    const goodsShop = await this.goodsShopRepository.findOne({
      where: { id },
      relations: ['goodsShopCategory', 'manager'],
    });
    if (!goodsShop) {
      throw new NotFoundException('존재하지 않는 상점입니다.');
    }
    // goodsShop 작성자와 수정 요청한 사용자가 일치한지 확인
    if (goodsShop.manager.userId !== userId) {
      throw new ForbiddenException('수정 권한이 없습니다.');
    }

    await this.goodsShopCategoryRepository.delete({
      goodsShop: { id }, //
    });

    await this.goodsShopRepository.delete(id);

    return {
      status: HttpStatus.OK,
      message: '상품 삭제에 성공하였습니다.',
      data: { id },
    };
  }
}
