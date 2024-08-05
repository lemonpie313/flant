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
  Query,
  UseInterceptors,
  UploadedFiles,
  UploadedFile,
} from '@nestjs/common';
import { MediaService } from './media.service';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { UserInfo } from 'src/util/decorators/user-info.decorator';
import { ApiFile } from 'src/util/decorators/api-file.decorator';
import { thumbnailImageUploadFactory } from 'src/util/image-upload/create-s3-storage';


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
    @UserInfo() user,
    @Query('communityId') communityId: number,
    @Body() createMediaDto: CreateMediaDto) {
    const userId = user.id;
    const mediaUrl = files.map(file => file.location)
    return this.mediaService.create(+userId, +communityId, createMediaDto, mediaUrl);
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
  @Get(':mediaId')
  findOne(@Param('mediaId') mediaId: number) {
    return this.mediaService.findOne(+mediaId);
  }

  /**
   * 썸네일 이미지 수정
   * @param user 
   * @param mediaId 
   * @param file 
   * @returns 
   */
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Patch(':mediaId/thumbnail')
  @ApiFile('thumbnailImage', thumbnailImageUploadFactory())
  async updateThumbnail(@UserInfo() user, @Param('mediaId') mediaId: number, @UploadedFile() file: Express.MulterS3.File){
    const userId = user.id
    const imageUrl = file.location
    return this.mediaService.updateThumbnail(+userId, +mediaId, imageUrl)
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
  @Patch(':mediaId')
  update(@UserInfo() user, @Param('mediaId') mediaId: number, @Body() updateMediaDto: UpdateMediaDto) {
    const userId = user.id;
    return this.mediaService.update(+userId, +mediaId, updateMediaDto);
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
  remove(@UserInfo() user, @Param('noticeId') noticeId: string) {
    const userId = user.id;
    return this.mediaService.remove(+userId, +noticeId);
  }
}
