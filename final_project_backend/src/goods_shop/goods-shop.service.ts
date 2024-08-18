import {
  BadRequestException,
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
import { Community } from 'src/community/entities/community.entity';
import { PartialUser } from 'src/user/interfaces/partial-user.entity';

@Injectable()
export class GoodsShopService {
  constructor(
    @InjectRepository(GoodsShop)
    private readonly goodsShopRepository: Repository<GoodsShop>,
    @InjectRepository(GoodsShopCategory)
    private readonly goodsShopCategoryRepository: Repository<GoodsShopCategory>,
    @InjectRepository(Manager)
    private readonly managerRepository: Repository<Manager>,
    @InjectRepository(Community)
    private readonly communityRepository: Repository<Community>,
  ) {}

  //상점 생성
  async goodsShopCreate(
    createGoodsShopDto: CreateGoodsShopDto,
    user: PartialUser,
  ) {
    const {
      communityId,
      artist,
      categoryName,
      detailInfo,
      name,
      goodsShopCode,
    } = createGoodsShopDto;

    //커뮤니티 유효성 검증
    const community = await this.communityRepository.findOne({
      where: { communityId },
    });
    if (!community) {
      throw new NotFoundException('커뮤니티가 존재하지 않습니다.');
    }

    //매니저 정보 가져와서 커뮤니티에 등록되어 있는지 확인
    const managerId = user?.roleInfo?.roleId;
    const manager = await this.managerRepository.findOne({
      where: { managerId },
    });
    if (manager.communityId !== communityId) {
      throw new BadRequestException(
        '해당 커뮤니티에 권한이 없는 매니저입니다.',
      );
    }

    // 상점 생성
    const saveGoodsShop = await this.goodsShopRepository.save({
      community,
      artist,
      name,
      goodsShopCode,
      detailInfo,
      manager,
    });

    const saveCategory = await this.goodsShopCategoryRepository.save({
      name: categoryName,
      goodsShop: saveGoodsShop,
    });

    return {
      status: HttpStatus.CREATED,
      message: '상점 생성에 성공하셨습니다.',
      data: {
        communityId: communityId,
        shopId: saveGoodsShop.id,
        manager: manager.managerId,
        name: saveGoodsShop.name,
        artist: saveGoodsShop.artist,
        category: saveCategory.name,
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
      category: goodsShops.goodsShopCategory[0].name,
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
      relations: ['goodsShopCategory', 'community'],
    });

    if (!goodsShop) {
      throw new NotFoundException('존재하지 않는 상점입니다.');
    }

    console.log(goodsShop);
    return {
      status: HttpStatus.OK,
      message: '상점 상세 조회에 성공하였습니다.',
      data: {
        shopId: goodsShop.id,
        communityId: goodsShop.community.communityId,
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
    user: PartialUser,
  ) {
    const managerId = user?.roleInfo?.roleId;
    const { name, artist, goodsShopCode, detailInfo, categoryName } =
      updateGoodsShopDto;

    //상점 유효성 체크
    const goodsShop = await this.goodsShopRepository.findOne({
      where: { id },
      relations: ['goodsShopCategory', 'manager', 'community'],
    });
    if (!goodsShop) {
      throw new NotFoundException('존재하지 않는 상점입니다.');
    }

    // GoodsShop 작성자와 수정 요청한 사용자가 일치한지 확인
    if (goodsShop.manager.managerId !== managerId) {
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
      data: {
        communityId: goodsShop.community.communityId,
        shopId: goodsShop.id,
        manager: goodsShop.manager.managerId,
        name: goodsShop.name,
        artist: goodsShop.artist,
        goodsShopCode: goodsShop.goodsShopCode,
        detailInfo: goodsShop.detailInfo,
        categoryName: goodsShop.goodsShopCategory[0].name,
        createdAt: goodsShop.createdAt,
        updatedAt: goodsShop.updatedAt,
      },
    };
  }

  async remove(id: number, user: PartialUser) {
    const goodsShop = await this.goodsShopRepository.findOne({
      where: { id },
      relations: ['goodsShopCategory', 'manager'],
    });
    if (!goodsShop) {
      throw new NotFoundException('존재하지 않는 상점입니다.');
    }
    // goodsShop 작성자와 수정 요청한 사용자가 일치한지 확인
    const managerId = user?.roleInfo?.roleId;
    if (goodsShop.manager.managerId !== managerId) {
      throw new ForbiddenException('수정 권한이 없습니다.');
    }

    await this.goodsShopCategoryRepository.delete({
      goodsShop: { id }, //
    });

    await this.goodsShopRepository.delete(id);

    return {
      status: HttpStatus.OK,
      message: '상점 삭제에 성공하였습니다.',
      data: { id },
    };
  }
}
