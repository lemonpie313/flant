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
} from '@nestjs/common';
import { MerchandiseService } from './merchandise.service';
import { CreateMerchandiseDto } from './dto/create-merchandise-post.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FindAllmerchandiseDto } from './dto/find-merchandise.dto';
import { UpdateMerchandiseDto } from './dto/update-merchandise.dto';
import { CommunityUserGuard } from 'src/auth/guards/community-user.guard';
import { PartialUser } from 'src/user/interfaces/partial-user.entity';
import { CommunityUserRole } from 'src/community/community-user/types/community-user-role.type';
import { CommunityUserRoles } from 'src/auth/decorators/community-user-roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UserInfo } from 'src/util/decorators/user-info.decorator';

@ApiTags('상품')
@Controller('v1/merchandise')
export class MerchandiseController {
  constructor(private readonly merchandiseService: MerchandiseService) {}

  /**
   * 상품 등록
   * @param createMerchandiseDto
   * @returns
   */
  @ApiBearerAuth()
  @CommunityUserRoles(CommunityUserRole.MANAGER)
  @UseGuards(JwtAuthGuard, CommunityUserGuard)
  @Post('/')
  async create(
    @Query('artistId') artistId: number,
    @Body() createMerchandiseDto: CreateMerchandiseDto,
    @UserInfo() user: PartialUser,
  ) {
    const data = await this.merchandiseService.create(
      createMerchandiseDto,
      user,
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
  @CommunityUserRoles(CommunityUserRole.MANAGER)
  @UseGuards(JwtAuthGuard, CommunityUserGuard)
  async update(
    @Param('merchandiseId') merchandiseId: string,
    @Body() updateMerchandiseDto: UpdateMerchandiseDto,
    @UserInfo() user: PartialUser,
  ) {
    const data = await this.merchandiseService.update(
      +merchandiseId,
      updateMerchandiseDto,
      user,
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
  @CommunityUserRoles(CommunityUserRole.MANAGER)
  @UseGuards(JwtAuthGuard, CommunityUserGuard)
  async remove(
    @Param('merchandiseId')
    merchandiseId: string,
    @UserInfo() user: PartialUser,
  ) {
    return await this.merchandiseService.remove(+merchandiseId, user);
  }
}
