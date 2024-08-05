import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  UploadedFiles,
  UploadedFile,
} from '@nestjs/common';
import { MediaService } from './media.service';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { UserInfo } from 'src/util/decorators/user-info.decorator';
import { ApiFile, ApiMedia } from 'src/util/decorators/api-file.decorator';
import { mediaFileUploadFactory, thumbnailImageUploadFactory } from 'src/util/image-upload/create-s3-storage';


@ApiTags('미디어')
@Controller('v1/media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  /**
   * 미디어 등록
   * @param files 
   * @param user 
   * @param communityId 
   * @param createMediaDto 
   * @returns 
   */
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiMedia([
    { name: 'mediaImage', maxCount: 3 },
    { name: 'mediaVideo', maxCount: 1 }
  ],
  mediaFileUploadFactory())
  @Post()
  create(
    @UploadedFiles() files: {mediaImage?: Express.MulterS3.File[], mediaVideo?: Express.MulterS3.File[]},
    @UserInfo() user,
    @Query('communityId') communityId: number,
    @Body() createMediaDto: CreateMediaDto) {
    const userId = user.id;
    let imageUrl = undefined
    if(files.mediaImage.length != 0){
      const imageLocation = files.mediaImage.map(file => file.location);
      imageUrl = imageLocation
    }
    let videoUrl = undefined
    if(files.mediaVideo.length != 0){
      const videoLocation = files.mediaVideo.map(file => file.location);
      videoUrl = videoLocation
    }
    return this.mediaService.create(+userId, +communityId, createMediaDto, imageUrl, videoUrl);
  }

  /**
   * 모든 미디어 조회
   * @returns
   */
  @Get()
  findAll(@Query('communityId') communityId: number) {
    return this.mediaService.findAll(communityId);
  }

  /**
   * 미디어 상세 조회
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
   * 미디어 수정
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
   * 미디어 삭제
   * @param req
   * @param noticeId
   * @returns
   */
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Delete(':mediaId')
  remove(@UserInfo() user, @Param('mediaId') mediaId: number) {
    const userId = user.id;
    return this.mediaService.remove(+userId, +mediaId);
  }
}
