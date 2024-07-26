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
import { MerchandiseService } from './merchandise.service';
import { CreateMerchandiseDto } from './dto/create-merchandise-post.dto';
import { ApiTags } from '@nestjs/swagger';
import { userInfo } from 'os';
import { FindAllmerchandiseDto } from './dto/find-merchandise.dto';
import { UpdateMerchandiseDto } from './dto/update-merchandise.dto';

@ApiTags('상품')
@Controller('v1/merchandise')
// @UserInfo()
// @UserGarud()
export class MerchandiseController {
  constructor(private readonly merchandiseService: MerchandiseService) {}

  // RoleGarud 추가 필요
  /**
   * 상품 등록
   * @param createMerchandiseDto
   * @returns
   */
  @Post()
  async create(@Body() createMerchandiseDto: CreateMerchandiseDto) {
    //유저 받아오기 추가필요
    const data = await this.merchandiseService.create(createMerchandiseDto);
    return data;
  }

  /**
   * 상품 전체 조회
   * @param findAllmerchandiseDto
   * @returns
   */
  @Get()
  async findAll(@Query() findAllmerchandiseDto: FindAllmerchandiseDto) {
    const data = await this.merchandiseService.findAll(findAllmerchandiseDto);
    return data;
  }

  /**
   * 상품 상세 조회
   * @param merchandiseId
   * @returns
   */
  @Get('/:merchandiseId')
  async findOne(@Param('merchandiseId') merchandiseId: string) {
    const data = await this.merchandiseService.findOne(+merchandiseId);
    return data;
  }

  /**
   * 상품 수정
   * @param merchandiseId
   * @param updateMerchandiseDto
   * @returns
   */
  @Patch('/:merchandiseId')
  async update(
    @Param('merchandiseId') merchandiseId: string,
    @Body() updateMerchandiseDto: UpdateMerchandiseDto,
  ) {
    //유저도 포함하여 전달 필요
    const data = await this.merchandiseService.update(
      +merchandiseId,
      updateMerchandiseDto,
    );
    return data;
  }

  /**
   * 상품 삭제
   * @param merchandiseId
   * @returns
   */
  @Delete('/:merchandiseId')
  remove(
    @Param('merchandiseId')
    merchandiseId: string /* @UserInfo() user: User 추가에정 */,
  ) {
    //유저아이디 추가하여 검증 필요
    return this.merchandiseService.remove(+merchandiseId);
  }
}
