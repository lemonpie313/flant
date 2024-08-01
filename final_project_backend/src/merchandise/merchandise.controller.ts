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
import { MerchandiseService } from './merchandise.service';
import { CreateMerchandiseDto } from './dto/create-merchandise-post.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { userInfo } from 'os';
import { FindAllmerchandiseDto } from './dto/find-merchandise.dto';
import { UpdateMerchandiseDto } from './dto/update-merchandise.dto';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/user/types/user-role.type';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@ApiTags('상품')
@Controller('v1/merchandise')
@UseGuards(AuthGuard('jwt'))
export class MerchandiseController {
  constructor(private readonly merchandiseService: MerchandiseService) {}

  /**
   * 상품 등록
   * @param createMerchandiseDto
   * @returns
   */
  @ApiBearerAuth()
  @Roles(UserRole.Manager)
  @UseGuards(RolesGuard)
  @Post()
  async create(@Body() createMerchandiseDto: CreateMerchandiseDto, @Req() req) {
    const userId = req.user.id;
    const data = await this.merchandiseService.create(
      createMerchandiseDto,
      userId,
    );
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
  @ApiBearerAuth()
  @Patch('/:merchandiseId')
  @Roles(UserRole.Manager)
  @UseGuards(AuthGuard('jwt'))
  @UseGuards(RolesGuard)
  async update(
    @Param('merchandiseId') merchandiseId: string,
    @Body() updateMerchandiseDto: UpdateMerchandiseDto,
    @Req() req,
  ) {
    const userId = req.user.id;
    const data = await this.merchandiseService.update(
      +merchandiseId,
      updateMerchandiseDto,
      userId,
    );
    return data;
  }

  /**
   * 상품 삭제
   * @param merchandiseId
   * @returns
   */
  @ApiBearerAuth()
  @Delete('/:merchandiseId')
  @Roles(UserRole.Manager)
  @UseGuards(AuthGuard('jwt'))
  @UseGuards(RolesGuard)
  async remove(
    @Param('merchandiseId')
    merchandiseId: string,
    @Req() req,
  ) {
    const userId = req.user.id;

    return await this.merchandiseService.remove(+merchandiseId, userId);
  }
}
