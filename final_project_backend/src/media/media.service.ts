import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual, Repository } from 'typeorm';
import { Manager } from 'src/admin/entities/manager.entity';
import _ from 'lodash';
import { Media } from './entities/media.entity';
import { MediaFile } from './entities/media-file.entity';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';
import { MESSAGES } from 'src/constants/message.constant';

@Injectable()
export class MediaService {
  constructor(
    @InjectRepository(Media)
    private readonly mediaRepository: Repository<Media>,
    @InjectRepository(MediaFile)
    private readonly mediaFileRepository: Repository<MediaFile>,
    @InjectRepository(Manager)
    private readonly managerRepository: Repository<Manager>,
  ){}
  async create(userId: number, communityId: number, createMediaDto: CreateMediaDto, imageUrl: string[] | undefined, videoUrl: string | undefined) {
    const isManager = await this.managerRepository.findOne({where: {userId: userId, communityId: communityId}})
    if(!isManager){
      throw new UnauthorizedException(MESSAGES.MEDIA.CREATE.UNAUTHORIZED)
    }

    const publishTime = new Date(
      createMediaDto.year,
      createMediaDto.month - 1,
      createMediaDto.day,
      createMediaDto.hour,
      createMediaDto.minute
    )

    const createdData = await this.mediaRepository.save({
      communityId: communityId,
      managerId: isManager.managerId,
      title: createMediaDto.title,
      content: createMediaDto.content,
      publishTime: publishTime,
    })

    if (imageUrl.length > 0) {
      for(let image of imageUrl){
        const mediaImageData = {
          mediaId: createdData.mediaId,
          managerId: isManager.managerId,
          mediaFileUrl: image
        }
        await this.mediaFileRepository.save(mediaImageData)
      }
    }
    if(videoUrl){
      const mediaVideoData = {
        mediaId: createdData.mediaId,
        managerId: isManager.managerId,
        mediaFileUrl: videoUrl
      }
      await this.mediaFileRepository.save(mediaVideoData)
    }
    return {
      status: HttpStatus.CREATED,
      message: MESSAGES.MEDIA.CREATE.SUCCEED,
      data: createdData,
    };
  }

  async findAll(communityId: number) {
    const currentTime = new Date()
    const mediaData = await this.mediaRepository.find({
      where: { communityId: communityId, publishTime: LessThanOrEqual(currentTime)},
      order: { createdAt: 'DESC'},
      relations: ['mediaFiles']
    })
    return {
      status: HttpStatus.OK,
      message: MESSAGES.MEDIA.FINDALL.SUCCEED,
      data: mediaData,
    };
  }

  async findOne(mediaId: number) {
    const singleMediaData = await this.mediaRepository.findOne({
      where: { mediaId: mediaId },
      relations: ['mediaFiles']
    })
    return {
      status: HttpStatus.OK,
      message: MESSAGES.MEDIA.FINDONE.SUCCEED,
      data: singleMediaData,
    };
  }

  async updateThumbnail(userId: number, mediaId: number, imageUrl: string){
    const mediaData = await this.mediaRepository.findOne({ where: { mediaId: mediaId }})
    if(!mediaData){
      throw new NotFoundException(MESSAGES.MEDIA.UPDATETHUMBNAIL.NOT_FOUND)
    }
    const isManager = await this.managerRepository.findOne({where: {
      userId: userId,
      communityId: mediaData.communityId
    }})
    if(!isManager){
      throw new UnauthorizedException(MESSAGES.MEDIA.UPDATETHUMBNAIL.UNAUTHORIZED)
    }
    if(!imageUrl){
      throw new BadRequestException(MESSAGES.MEDIA.UPDATETHUMBNAIL.BAD_REQUEST)
    }
    await this.mediaRepository.update(
      {mediaId: mediaId},
      {thumbnailImage: imageUrl})
    const updatedData = await this.mediaRepository.findOne({ where: { mediaId: mediaId }})

    return {
      status: HttpStatus.OK,
      message: MESSAGES.MEDIA.UPDATETHUMBNAIL.BAD_REQUEST,
      data: updatedData,
    }
  }

  async update(
    userId: number,
    mediaId: number,
    updateMediaDto: UpdateMediaDto,
  ) {
    const mediaData = await this.mediaRepository.findOne({
      where: { mediaId: mediaId },
    });
    if (!mediaData) {
      throw new NotFoundException(MESSAGES.MEDIA.UPDATE.NOT_FOUND);
    }
    const isManager = await this.managerRepository.findOne({
      where: {
        userId: userId,
        communityId: mediaData.communityId,
      },
    });
    if (!isManager) {
      throw new UnauthorizedException(MESSAGES.MEDIA.UPDATE.UNAUTHORIZED);
    }
    if (_.isEmpty(updateMediaDto)) {
      throw new BadRequestException(MESSAGES.MEDIA.UPDATE.BAD_REQUEST);
    }
    await this.mediaRepository.update(
      { mediaId: mediaId },
      { title: updateMediaDto.title, content: updateMediaDto.content },
    );
    const updatedData = await this.mediaRepository.findOne({
      where: { mediaId: mediaId },
    });
    return {
      status: HttpStatus.ACCEPTED,
      message: MESSAGES.MEDIA.UPDATE.SUCCEED,
      data: updatedData,
    };
  }

  async remove(userId: number, mediaId: number) {
    const mediaData = await this.mediaRepository.findOne({
      where: { mediaId: mediaId },
    });
    if (!mediaData) {
      throw new NotFoundException(MESSAGES.MEDIA.REMOVE.NOT_FOUND);
    }
    const isManager = await this.managerRepository.findOne({
      where: { userId: userId, communityId: mediaData.communityId },
    });
    if (!isManager) {
      throw new UnauthorizedException(MESSAGES.MEDIA.REMOVE.UNAUTHORIZED);
    }
    await this.mediaRepository.delete(mediaId);
    return {
      status: HttpStatus.OK,
      message: MESSAGES.MEDIA.REMOVE.SUCCEED,
      data: mediaId,
    };
  }
}
