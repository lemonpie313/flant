import {
  BadRequestException,
  ConflictException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  OnModuleInit,
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
import { Cache } from '@nestjs/cache-manager';

@Injectable()
export class MediaService implements OnModuleInit {
  constructor(
    @InjectRepository(Media)
    private readonly mediaRepository: Repository<Media>,
    @InjectRepository(MediaFile)
    private readonly mediaFileRepository: Repository<MediaFile>,
    @InjectRepository(Manager)
    private readonly managerRepository: Repository<Manager>,
    @Inject('CACHE_MANAGER') private readonly cacheManager: Cache,
  ){}
  async create(
    userId: number,
    createMediaDto: CreateMediaDto,
    imageUrl: string[] | undefined,
    videoUrl: string | undefined
  ) {
    if(imageUrl && (videoUrl || createMediaDto.youtubeUrl)){
      throw new BadRequestException(MESSAGES.MEDIA.CREATE.BAD_REQUEST)
    }
    if(videoUrl && createMediaDto.youtubeUrl){
      throw new ConflictException(MESSAGES.MEDIA.CREATE.CONFLICT)
    }

    const publishTime = new Date(
      createMediaDto.year,
      createMediaDto.month - 1,
      createMediaDto.day,
      createMediaDto.hour,
      createMediaDto.minute
    )

    const createdData = await this.mediaRepository.save({
      communityId: createMediaDto.communityId,
      managerId: userId,
      title: createMediaDto.title,
      content: createMediaDto.content,
      publishTime: publishTime,
    })

    if (imageUrl && imageUrl.length > 0) {
      for(let image of imageUrl){
        const mediaImageData = {
          mediaId: createdData.mediaId,
          managerId: userId,
          mediaFileUrl: image
        }
        await this.mediaFileRepository.save(mediaImageData)
      }
    }
    if(videoUrl || createMediaDto.youtubeUrl){
      const mediaVideoData = {
        mediaId: createdData.mediaId,
        managerId: userId,
        mediaFileUrl: videoUrl,
      }
      if(videoUrl){
        mediaVideoData.mediaFileUrl = videoUrl
      }
      else if(createMediaDto.youtubeUrl){
        mediaVideoData.mediaFileUrl = createMediaDto.youtubeUrl
      }
      await this.mediaFileRepository.save(mediaVideoData)
    }

    //글이 작성될때 최신순 캐시 업데이트
    await this.updateCache(createdData.mediaId)

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
    await this.cacheManager.set('mediaId', singleMediaData, 60 * 1000 )
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
      { mediaId: mediaId },
      { thumbnailImage: imageUrl })
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
    imageUrl: string[] | undefined,
    videoUrl: string | undefined,
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
    const newData = {
      title: mediaData.title,
      content: mediaData.content,
      publishTime: mediaData.publishTime,
    }

    const newPublishTime = new Date(
      updateMediaDto.year,
      updateMediaDto.month - 1,
      updateMediaDto.day,
      updateMediaDto.hour,
      updateMediaDto.minute
    )

    if(newPublishTime != mediaData.publishTime){
      newData.publishTime = newPublishTime
    }
    if(updateMediaDto.title != mediaData.title){
      newData.title = updateMediaDto.title
    }
    if(updateMediaDto.content != mediaData.content){
      newData.content = updateMediaDto.content
    }

    if (imageUrl && imageUrl.length > 0 || videoUrl) {
      await this.mediaFileRepository
      .createQueryBuilder()
      .delete() 
      .from(MediaFile)
      .where('media_id = :mediaId', { mediaId })
      .execute();
      
      if(imageUrl){
      for(let image of imageUrl){
        const mediaImageData = {
          mediaId: mediaData.mediaId,
          managerId: isManager.managerId,
          mediaFileUrl: image,
        }
        await this.mediaFileRepository.save(mediaImageData)
      }
    }
      if(videoUrl){
        const mediaVideoData = {
          mediaId: mediaData.mediaId,
          managerId: isManager.managerId,
          mediaFileUrl: videoUrl,
        }
        await this.mediaFileRepository.save(mediaVideoData)
      }
    }

    await this.mediaRepository.update(
      { mediaId: mediaId },
      newData,
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

  //서버 시작시 최근 게시글 5개 캐시
  async onModuleInit() {
    const recentMedia = await this.mediaRepository.find({
      relations: ['mediaFiles'],
      order: { createdAt: 'DESC' },
      take: 5,
    })
    const recentMediaIds: number[] = []
    for(let mediaData of recentMedia){
      const mediaId = mediaData.mediaId
      recentMediaIds.push(mediaId)

      const Data = await this.mediaRepository.findOne({ 
        where: { mediaId: mediaId }, 
        relations: ['mediaFiles']
      })
      const cachingData = {
        status: HttpStatus.OK,
        message: MESSAGES.MEDIA.FINDONE.SUCCEED,
        data: Data
      }
      await this.cacheManager.set(`mediaId_${mediaId}`, cachingData, 0)
    }
    await this.cacheManager.set('cachedMediaIds', recentMediaIds, 0)
  }

  //글이 작성될때 최신글 캐시 목록 수정
  async updateCache(newMediaId: number){
    const newData = await this.mediaRepository.findOne({ where: { mediaId : newMediaId }})

    const recentMediaIds: number[] = await this.cacheManager.get('cachedMediaIds')
    
    await this.cacheManager.del(`mediaId_${recentMediaIds[0]}`)

    recentMediaIds.pop()
    recentMediaIds.unshift(newData.mediaId)

    await this.cacheManager.set(`mediaId_${newData.mediaId}`, newData, 0)
    await this.cacheManager.set('cachedMediaIds', recentMediaIds, 0)
  }
}
