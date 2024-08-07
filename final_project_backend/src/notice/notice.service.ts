import {
  BadGatewayException,
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateNoticeDto } from './dto/create-notice.dto';
import { UpdateNoticeDto } from './dto/update-notice.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Notice } from './entities/notice.entity';
import { Repository } from 'typeorm';
import { Manager } from 'src/admin/entities/manager.entity';
import { NoticeImage } from './entities/notice-image.entity';
import _ from 'lodash';
import { MESSAGES } from 'src/constants/message.constant';

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
  async create(userId: number, communityId: number, createNoticeDto: CreateNoticeDto, imageUrl: string[] | undefined) {
    const isManager = await this.managerRepository.findOne({where: {userId: userId, communityId: communityId}})
    if(!isManager){
      throw new UnauthorizedException(MESSAGES.NOTICE.CREATE.UNAUTHORIZED)
    }

    const createdData = await this.noticeRepository.save({
      communityId: communityId,
      managerId: isManager.managerId,
      title: createNoticeDto.title,
      content: createNoticeDto.content,
    })

    if (imageUrl && imageUrl.length > 0) {
      for(let image of imageUrl){
        const noticeImageData = {
          noticeId: createdData.noticeId,
          managerId: isManager.managerId,
          noticeImageUrl: image
        }
        await this.noticeImageRepository.save(noticeImageData)
      }
    }
    return {
      status: HttpStatus.CREATED,
      message: MESSAGES.NOTICE.CREATE.SUCCEED,
      data: createdData,
    };
  }

  async findAll(communityId: number) {
    const noticeData = await this.noticeRepository.find({
      where: { communityId: communityId },
      order: { createdAt: 'DESC' },
      relations: ['noticeImages'],
    });
    return {
      status: HttpStatus.OK,
      message: MESSAGES.NOTICE.FINDALL.SUCCEED,
      data: noticeData,
    };
  }

  async findOne(noticeId: number) {
    const singleNoticeData = await this.noticeRepository.findOne({
      where: { noticeId: noticeId },
      relations: ['noticeImages'],
    });
    return {
      status: HttpStatus.OK,
      message: MESSAGES.NOTICE.FINDONE.SUCCEED,
      data: singleNoticeData,
    };
  }

  async update(
    userId: number,
    noticeId: number,
    updateNoticeDto: UpdateNoticeDto,
    imageUrl: string[] | undefined,
  ) {
    const noticeData = await this.noticeRepository.findOne({
      where: { noticeId: noticeId },
    });
    if (!noticeData) {
      throw new NotFoundException(MESSAGES.NOTICE.UPDATE.NOT_FOUND);
    }
    const isManager = await this.managerRepository.findOne({
      where: {
        userId: userId,
        communityId: noticeData.communityId,
      },
    });
    if (!isManager) {
      throw new UnauthorizedException(MESSAGES.NOTICE.UPDATE.UNAUTHORIZED);
    }
    if (_.isEmpty(updateNoticeDto.title && updateNoticeDto.content)) {
      throw new BadRequestException(MESSAGES.NOTICE.UPDATE.BAD_REQUEST);
    }

    await this.noticeRepository.update(
      { noticeId: noticeId },
      { title: updateNoticeDto.title, content: updateNoticeDto.content },
    );


    //입력된 imageUrl이 있을 경우에
    if (imageUrl && imageUrl.length > 0) {
      //postId에 연결된 모든 postImage 데이터 삭제
      //의도 : DELETE FROM post_image WHERE notice_id = noticeId
      await this.noticeImageRepository
      .createQueryBuilder()
      .delete() 
      .from(NoticeImage)
      .where('notice_id = :noticeId', { noticeId })
      .execute();

      //업로드된 이미지 숫자만큼 다시 생성
      for(let image of imageUrl){
        const noticeImageData = {
          noticeId: noticeData.noticeId,
          postImageUrl: image
        }
        await this.noticeImageRepository.save(noticeImageData)
      }
    }

    const updatedData = await this.noticeRepository.findOne({
      where: { noticeId: noticeId },
    });
    return {
      status: HttpStatus.ACCEPTED,
      message: MESSAGES.NOTICE.UPDATE.SUCCEED,
      data: updatedData,
    };
  }

  async remove(userId: number, noticeId: number) {
    const noticeData = await this.noticeRepository.findOne({
      where: { noticeId: noticeId },
    });
    if (!noticeData) {
      throw new NotFoundException(MESSAGES.NOTICE.REMOVE.NOT_FOUND);
    }
    const isManager = await this.managerRepository.findOne({
      where: { userId: userId, communityId: noticeData.communityId },
    });
    if (!isManager) {
      throw new UnauthorizedException(MESSAGES.NOTICE.REMOVE.UNAUTHORIZED);
    }
    await this.noticeRepository.delete(noticeId);
    return {
      status: HttpStatus.OK,
      message: MESSAGES.NOTICE.REMOVE.SUCCEED,
      data: noticeId,
    };
  }
}
