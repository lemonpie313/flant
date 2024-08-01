import {
  Controller,
  Post,
  UseGuards,
  Request,
  HttpStatus,
  Body,
  Query,
  Param,
  Get,
} from '@nestjs/common';
import { LiveService } from './live.service';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/user/types/user-role.type';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { CreateLiveDto } from './dtos/create-live.dto';

@ApiTags('live')
@Controller('live')
export class LiveController {
  constructor(private readonly liveService: LiveService) {}

  /**
   * 라이브 스트리밍 제목 등록 + 키 받아오기
   * 
   * @returns
   */
  @ApiBearerAuth()
  @Roles(UserRole.User)
  @UseGuards(RolesGuard)
  @Post('/')
  async createLive(
    @Request() req,
    @Body() createLiveDto: CreateLiveDto,
  ) {
    const { title, liveType } = createLiveDto;
    const liveRtmpAddress = this.liveService.createLive(1, title, liveType);
    return {
      status: HttpStatus.CREATED,
      message: '완료',
      data: liveRtmpAddress,
    };
  }

  /**
   * 라이브 목록 조회
   * 
   * @returns
   */
  @ApiBearerAuth()
  @Roles(UserRole.User)
  @UseGuards(RolesGuard)
  @Get('/')
  async findAllLives(
    @Request() req,
    @Query('communityId') communityId: number
  ) {
    const lives = await this.liveService.findAllLives(communityId);
    return {
      status: HttpStatus.OK,
      message: '완료',
      data: lives,
    };
  }

  /**
   * 라이브 실시간 시청..어쩌라고..?
   * 
   * @returns
   */
  @ApiBearerAuth()
  @Roles(UserRole.User)
  @UseGuards(RolesGuard)
  @Get('/:liveId')
  async watchLive(
    @Request() req,
    @Param('liveId') liveId: number,
  ) {
    const live = await this.liveService.watchLive(liveId);
    return {
      status: HttpStatus.CREATED,
      message: '완료',
      data: live,
    };
  }

  /**
   * 라이브 다시보기
   * 
   * @returns
   */
  @ApiBearerAuth()
  @Roles(UserRole.User)
  @UseGuards(RolesGuard)
  @Get('/:liveId/recordings')
  async watchRecordedLive(
    @Request() req,
    @Param('liveId') liveId: number,
  ) {
    const live = await this.liveService.watchRecordedLive(liveId);
    return {
      status: HttpStatus.CREATED,
      message: '완료',
      data: live,
    };
  }
}
