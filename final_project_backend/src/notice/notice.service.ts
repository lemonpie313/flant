import { BadGatewayException, BadRequestException, HttpStatus, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateNoticeDto } from './dto/create-notice.dto';
import { UpdateNoticeDto } from './dto/update-notice.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Notice } from './entities/notice.entity';
import { Repository } from 'typeorm';
import { Manager } from 'src/admin/entities/manager.entity';
import { NoticeImage } from './entities/notice-image.entity';
import _ from 'lodash';

@Injectable()
export class NoticeService {
  constructor(
    @InjectRepository(Notice)
    private readonly noticeRepository: Repository<Notice>,
    @InjectRepository(NoticeImage)
    private readonly noticeImageRepository: Repository<NoticeImage>,
    @InjectRepository(Manager)
    private readonly managerRepository: Repository<Manager>,
  ){}
  async create(userId: number, communityId: number, createNoticeDto: CreateNoticeDto) {
    const isManager = await this.managerRepository.findOne({where: {userId: userId, communityId: communityId}})
    if(!isManager){
      throw new UnauthorizedException('공지 작성 권한이 없습니다.')
    }
    const newSavingData = new Notice();
    newSavingData.title = createNoticeDto.title;
    newSavingData.content = createNoticeDto.content;
    newSavingData.managerId = isManager.managerId;
    newSavingData.communityId = communityId;

    const createdData = await this.noticeRepository.save(newSavingData)

    if (createNoticeDto.noticeImageUrl) {
      const noticeImageData = {
        noticeId: newSavingData.noticeId,
        noticeImageUrl: createNoticeDto.noticeImageUrl,
      };
      await this.noticeImageRepository.save(noticeImageData);
    }
    return {
      status: HttpStatus.CREATED,
      message: '공지 등록에 성공했습니다.',
      data: createdData,
    };
  }

  async findAll(communityId: number) {
    const noticeData = await this.noticeRepository.find({
      where: { communityId: communityId },
      order: { createdAt: 'DESC'},
      relations: ['noticeImages']
    })
    return {
      status: HttpStatus.OK,
      message: '모든 공지사항 조회에 성공했습니다.',
      data: noticeData,
    };
  }

  async findOne(noticeId: number) {
    const singleNoticeData = await this.noticeRepository.findOne({
      where: { noticeId: noticeId },
      relations: ['noticeImages']
    })
    return {
      status: HttpStatus.OK,
      message: '공지사항 조회에 성공했습니다.',
      data: singleNoticeData,
    };
  }

  async update(userId: number, noticeId: number, updateNoticeDto: UpdateNoticeDto) {
    const noticeData = await this.noticeRepository.findOne({where: { noticeId: noticeId }})
    if(!noticeData){
      throw new NotFoundException('공지를 찾을 수 없습니다.')
    }
    const isManager = await this.managerRepository.findOne({where: {
      userId: userId,
      communityId: noticeData.communityId
    }})
    if(!isManager){
      throw new UnauthorizedException('공지 수정 권한이 없습니다.')
    }
    if(_.isEmpty(updateNoticeDto)){
      throw new BadRequestException('수정할 내용을 입력해주세요.')
    }
    await this.noticeRepository.update(
      { noticeId: noticeId }, 
      { title: updateNoticeDto.title,
        content: updateNoticeDto.content
      })

    const updatedData = await this.noticeRepository.findOne({where: { noticeId: noticeId }})
    return {
      status: HttpStatus.ACCEPTED,
      message: '공지 수정되었습니다.',
      data: updatedData,
    };
  }

  async remove(userId: number, noticeId: number) {
    const noticeData = await this.noticeRepository.findOne({where: {noticeId: noticeId}})
    if(!noticeData){
      throw new NotFoundException('공지를 찾을 수 없습니다.')
    }
    const isManager = await this.managerRepository.findOne({where: {userId: userId, communityId: noticeData.communityId}})
    if(!isManager){
      throw new UnauthorizedException('공지 삭제 권한이 없습니다.')
    }
    await this.noticeRepository.delete(noticeId)
    return {
      status: HttpStatus.OK,
      message: '공지 삭제에 성공했습니다.',
      data: noticeId,
    };
  }
}
