import { BadRequestException, HttpStatus, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Manager } from 'src/admin/entities/manager.entity';
import _ from 'lodash';
import { Media } from './entities/media.entity';
import { MediaFile } from './entities/media-file.entity';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';

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
  async create(userId: number, communityId: number, createMediaDto: CreateMediaDto) {
    const isManager = await this.managerRepository.findOne({where: {userId: userId, communityId: communityId}})
    if(!isManager){
      throw new UnauthorizedException('미디어 등록 권한이 없습니다.')
    }
    const newSavingData = new Media();
    newSavingData.title = createMediaDto.title;
    newSavingData.content = createMediaDto.content;
    newSavingData.managerId = isManager.managerId;
    newSavingData.communityId = communityId;

    const createdData = await this.mediaRepository.save(newSavingData)
    /*
    if (createNoticeDto.noticeImageUrl) {
      const noticeImageData = {
        noticeId: newSavingData.noticeId,
        noticeImageUrl: createNoticeDto.noticeImageUrl,
      };
      await this.noticeImageRepository.save(noticeImageData);
    }
      */
    return {
      status: HttpStatus.CREATED,
      message: '공지 등록에 성공했습니다.',
      data: createdData,
    };
  }

  async findAll(communityId: number) {
    const mediaData = await this.mediaRepository.find({
      where: { communityId: communityId },
      order: { createdAt: 'DESC'},
      relations: ['mediaFiles']
    })
    return {
      status: HttpStatus.OK,
      message: '모든 미디어 목록 조회에 성공했습니다.',
      data: mediaData,
    };
  }

  async findOne(mediaId: number) {
    const singleMediaData = await this.mediaRepository.findOne({
      where: { mediaId: mediaId },
      relations: ['noticeImages']
    })
    return {
      status: HttpStatus.OK,
      message: '미디어 조회에 성공했습니다.',
      data: singleMediaData,
    };
  }

  async update(userId: number, mediaId: number, updateMediaDto: UpdateMediaDto) {
    const mediaData = await this.mediaRepository.findOne({where: { mediaId: mediaId }})
    if(!mediaData){
      throw new NotFoundException('미디어를 찾을 수 없습니다.')
    }
    const isManager = await this.managerRepository.findOne({where: {
      userId: userId,
      communityId: mediaData.communityId
    }})
    if(!isManager){
      throw new UnauthorizedException('공지 수정 권한이 없습니다.')
    }
    if(_.isEmpty(updateMediaDto)){
      throw new BadRequestException('수정할 내용을 입력해주세요.')
    }
    await this.mediaRepository.update(
      { mediaId: mediaId }, 
      { title: updateMediaDto.title,
        content: updateMediaDto.content
      })
    const updatedData = await this.mediaRepository.findOne({where: { mediaId: mediaId }})
    return {
      status: HttpStatus.ACCEPTED,
      message: '공지 수정되었습니다.',
      data: updatedData,
    };
  }

  async remove(userId: number, mediaId: number) {
    const mediaData = await this.mediaRepository.findOne({where: {mediaId: mediaId}})
    if(!mediaData){
      throw new NotFoundException('공지를 찾을 수 없습니다.')
    }
    const isManager = await this.managerRepository.findOne({where: {userId: userId, communityId: mediaData.communityId}})
    if(!isManager){
      throw new UnauthorizedException('공지 삭제 권한이 없습니다.')
    }
    await this.mediaRepository.delete(mediaId)
    return {
      status: HttpStatus.OK,
      message: '공지 삭제에 성공했습니다.',
      data: mediaId,
    };
  }
}
