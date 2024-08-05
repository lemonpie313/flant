import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UploadedFile,
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
import { coverImageUploadFactory, logoImageUploadFactory } from 'src/factory/community-image-upload.factory';
import { UserInfo } from 'src/util/decorators/user-info.decorator';
import { ApiFile } from 'src/util/decorators/api-file.decorator';

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
  async create(@Body() createCommunityDto: CreateCommunityDto) {
    return await this.communityService.create(createCommunityDto);
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
    @UserInfo() user,
    @Param('communityId') communityId: number,
    @Body() nickName: CommunityAssignDto,
  ) {
    const userId = user.id;
    return await this.communityService.assignCommunity(
      +userId,
      +communityId,
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
  async findMy(@UserInfo() user) {
    const userId = user.id;
    return await this.communityService.findMy(+userId);
  }

  /**
   * 단일 커뮤니티 조회
   * @returns
   */
  @Get(':communityId')
  async findOne(@Param('communityId') communityId: number) {
    return await this.communityService.findOne(communityId);
  }

  /**
   * 로고 이미지 수정
   * @param req
   * @param communityId
   * @param File
   * @returns
   */
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiFile('logoImage', logoImageUploadFactory())
  @Patch(':communityId/logo')
  async updateLogo(
    @UserInfo() user,
    @Param('communityId') communityId: number,
    @UploadedFile() File: Express.MulterS3.File,
  ){
    const userId = user.id;
    const imageUrl = File.location;
    return await this.communityService.updateLogo(
      +userId,
      +communityId,
      imageUrl,
    );
  }

  /**
   * 커버 이미지 수정
   * @param req
   * @param communityId
   * @param File
   * @returns
   */
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiFile('coverImage', coverImageUploadFactory())
  @Patch(':communityId/cover')
  async updateCover(
    @UserInfo() user,
    @Param('communityId') communityId: number,
    @UploadedFile() File: Express.MulterS3.File,
  ){
    const userId = user.id;
    const imageUrl = File.location;
    return await this.communityService.updateCover(
      +userId,
      +communityId,
      imageUrl,
    );
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
    @UserInfo() user,
    @Param('communityId') communityId: number,
    @Body() updateCommunityDto: UpdateCommunityDto,
  ) {
    const userId = user.id;
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
  remove(@UserInfo() user, @Param('communityId') communityId: number) {
    const userId = user.id;
    return this.communityService.removeCommunity(+userId, +communityId);
  }
}
