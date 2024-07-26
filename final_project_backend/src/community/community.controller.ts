import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CommunityService } from './community.service';
import { CreateCommunityDto } from './dto/create-community.dto';
import { UpdateCommunityDto } from './dto/update-community.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { CommunityAssignDto } from './dto/community-assign.dto';
import { UserRole } from 'src/user/types/user-role.type';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@ApiTags('커뮤니티')
@Controller('v1/community')
export class CommunityController {
  constructor(private readonly communityService: CommunityService) {}

  /**
   * 커뮤니티 생성
   * @param req
   * @param createCommunityDto
   * @returns
   */
  @ApiBearerAuth()
  @Roles(UserRole.Admin)
  @UseGuards(RolesGuard)
  @Post()
  async create(@Request() req, @Body() createCommunityDto: CreateCommunityDto) {
    const userId = req.user.id;
    return await this.communityService.create(+userId, createCommunityDto);
  }

  /**
   * 커뮤니티 가입
   * @param userId
   * @param communityId
   * @param nickName
   * @returns
   */
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post(':communityId/assign')
  async assignCommunity(
    @Request() userId: number,
    @Param('communityId') communityId: number,
    @Body() nickName: CommunityAssignDto,
  ) {
    return await this.communityService.assignCommunity(
      userId,
      communityId,
      nickName,
    );
  }

  /**
   * 전체 커뮤니티 조회(권한 불필요)
   * @returns
   */
  @Get()
  async findAll() {
    return await this.communityService.findAll();
  }

  /**
   * 내가 가입한 커뮤니티 조회
   * @param req
   * @returns
   */
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get('my')
  async findMy(@Request() req) {
    const userId = req.user.id;
    return await this.communityService.findMy(userId);
  }

  /**
   * 커뮤니티 수정
   * @param req
   * @param communityId
   * @param updateCommunityDto
   * @returns
   */
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Patch(':communityId')
  async updateCommunity(
    @Request() req,
    @Param('communityId') communityId: number,
    @Body() updateCommunityDto: UpdateCommunityDto,
  ) {
    const userId = req.user.id;
    return await this.communityService.updateCommunity(
      +userId,
      +communityId,
      updateCommunityDto,
    );
  }

  /**
   * 커뮤니티 삭제
   * @param req
   * @param communityId
   * @returns
   */
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Delete(':communityId')
  remove(@Request() req, @Param('communityId') communityId: number) {
    const userId = req.user.id;
    return this.communityService.removeCommunity(+userId, +communityId);
  }
}
