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
   * @param id
   * @returns
   */
  @Get('/:merchandise_id')
  async findOne(@Param('merchandise_id') id: string) {
    const data = await this.merchandiseService.findOne(+id);
    return data;
  }

  /**
   * 상품 수정
   * @param id
   * @param updateMerchandiseDto
   * @returns
   */
  @Patch('/:merchandise_id')
  async update(
    @Param('merchandise_id') id: string,
    @Body() updateMerchandiseDto: UpdateMerchandiseDto,
  ) {
    //유저도 포함하여 전달 필요
    const data = await this.merchandiseService.update(
      +id,
      updateMerchandiseDto,
    );
    return data;
  }

  /**
   * 상품 삭제
   * @param id
   * @returns
   */
  @Delete('/:merchandise_id')
  remove(
    @Param('merchandise_id') id: string /* @UserInfo() user: User 추가에정 */,
  ) {
    return this.merchandiseService.remove(+id);
  }
}
