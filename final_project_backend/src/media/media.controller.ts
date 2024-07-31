import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { MediaService } from './media.service';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

@ApiTags('미디어')
@Controller('v1/media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileFieldsInterceptor([{ name: 'mediaFiles', maxCount: 3 }]))
  @Post()
  create(
    @UploadedFiles() files: Express.MulterS3.File[],
    @Request() req,
    @Query('communityId') communityId: number,
    @Body() createMediaDto: CreateMediaDto) {
    const userId = req.user.id;
    return this.mediaService.create(+userId, +communityId, createMediaDto);
  }

  /**
   * 모든 공지사항 조회
   * @returns 
   */
  @Get()
  findAll(@Query('communityId') communityId: number) {
    return this.mediaService.findAll(communityId);
  }

  /**
   * 공지 상세 조회
   * @param noticeId 
   * @returns 
   */
  @Get(':noticeId')
  findOne(@Param('noticeId') noticeId: number) {
    return this.mediaService.findOne(+noticeId);
  }

  /**
   * 공지 수정
   * @param req 
   * @param noticeId 
   * @param updateNoticeDto 
   * @returns 
   */
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Patch(':noticeId')
  update(@Request() req, @Param('noticeId') noticeId: number, @Body() updateMediaDto: UpdateMediaDto) {
    const userId = req.user.id;
    return this.mediaService.update(+userId, +noticeId, updateMediaDto);
  }

  /**
   * 공지 삭제
   * @param req 
   * @param noticeId 
   * @returns 
   */
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Delete(':noticeId')
  remove(@Request() req, @Param('noticeId') noticeId: string) {
    const userId = req.user.id;
    return this.mediaService.remove(+userId, +noticeId);
  }
}
