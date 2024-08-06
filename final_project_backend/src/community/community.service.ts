import {
  BadRequestException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateCommunityDto } from './dto/create-community.dto';
import { UpdateCommunityDto } from './dto/update-community.dto';
import { Community } from './entities/community.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommunityUser } from './community-user/entities/communityUser.entity';
import { CommunityAssignDto } from './dto/community-assign.dto';
import _ from 'lodash';
import { Manager } from 'src/admin/entities/manager.entity';
import { NotificationService } from './../notification/notification.service';
import { MESSAGES } from 'src/constants/message.constant';

@Injectable()
export class CommunityService {
  constructor(
    @InjectRepository(Community)
    private readonly communityRepository: Repository<Community>,
    @InjectRepository(CommunityUser)
    private readonly communityUserRepository: Repository<CommunityUser>,
    @InjectRepository(Manager)
    private readonly managerRepository: Repository<Manager>,
    private readonly notificationService: NotificationService,
  ) {}

  async create(createCommunityDto: CreateCommunityDto) {
    const createCommunity =
      await this.communityRepository.save(createCommunityDto);
    return {
      status: HttpStatus.CREATED,
      message: MESSAGES.COMMUNITY.CREATE.SUCCEED,
      data: createCommunity,
    };
  }

  async assignCommunity(
    userId: number,
    communityId: number,
    communityAssignDto: CommunityAssignDto,
  ) {
    const assignData = await this.communityUserRepository.save({
      userId: userId,
      communityId: communityId,
      nickName: communityAssignDto.nickName,
    });
    const assignedName = assignData.nickName;
    const findCommunity = await this.communityRepository.findOne({
      where: { communityId: communityId },
    });
    const communityName = findCommunity.communityName;
    const Data = { assignedName, communityName };
    this.notificationService.emitCardChangeEvent(userId);
    return {
      status: HttpStatus.OK,
      message: MESSAGES.COMMUNITY.ASSIGN.SUCCEED,
      data: Data,
    };
  }

  async findAll() {
    const allCommunities = await this.communityRepository.find({
      select: ['communityLogoImage', 'communityName'],
    });
    return {
      status: HttpStatus.OK,
      message: MESSAGES.COMMUNITY.FIND.SUCCEED,
      data: allCommunities,
    };
  }

  async findMy(userId: number) {
    const myCommunities = await this.communityUserRepository.find({
      where: { userId: userId },
      relations: ['community'],
    });

    const myData = myCommunities.map(
      (communityUser) => communityUser.community,
    );

    return {
      status: HttpStatus.OK,
      message: MESSAGES.COMMUNITY.FINDMY.SUCCEED,
      data: myData,
    };
  }

  async findOne(communityId: number) {
    const oneCommunityData = await this.communityRepository.findOne({
      where: { communityId: communityId },
      relations: ['posts', 'posts.postImages'],
    });

    return {
      status: HttpStatus.OK,
      message: MESSAGES.COMMUNITY.FINDONE.SUCCEED,
      data: oneCommunityData,
    };
  }
 
  async updateCommunity(
    userId: number,
    communityId: number,
    updateCommunityDto: UpdateCommunityDto,
  ) {
    //입력된 수정 사항이 없을 경우
    if (_.isEmpty(updateCommunityDto)) {
      throw new BadRequestException(MESSAGES.COMMUNITY.UPDATE.REQUIRED);
    }
    //매니저 이외의 접근일 경우
    const isManager = await this.managerRepository.findOne({
      where: { userId: userId, communityId: communityId },
    });
    if (!isManager) {
      throw new UnauthorizedException(MESSAGES.COMMUNITY.UPDATE.UNAUTHORIZED);
    }
    //수정된 사항만 반영
    const existData = await this.communityRepository.findOne({
      where: { communityId: communityId },
    });
    if (updateCommunityDto.communityName == undefined) {
      updateCommunityDto.communityName = existData.communityName;
    }
    if (updateCommunityDto.membershipPrice == undefined) {
      updateCommunityDto.membershipPrice = existData.membershipPrice;
    }
    //수정 진행
    await this.communityRepository.update(
      { communityId: communityId },
      updateCommunityDto,
    );
    const updatedData = await this.communityRepository.findOne({
      where: { communityId: +communityId },
    });
    return {
      status: HttpStatus.ACCEPTED,
      message: MESSAGES.COMMUNITY.UPDATE.SUCCEED,
      data: updatedData,
    };
  }

  async removeCommunity(userId: number, communityId: number) {
    //매니저 이외의 접근일 경우
    const isManager = await this.managerRepository.findOne({
      where: { userId: userId, communityId: communityId },
    });
    if (!isManager) {
      throw new UnauthorizedException(MESSAGES.COMMUNITY.REMOVE.UNAUTHORIZED);
    }

    await this.communityRepository.delete(communityId);

    return {
      status: HttpStatus.OK,
      message: MESSAGES.COMMUNITY.REMOVE.SUCCEED,
      data: communityId,
    };
  }
  
  async updateLogo(userId: number, communityId: number, imageUrl: string){
    //매니저 이외의 접근일 경우
    const isManager = await this.managerRepository.findOne({
      where: { userId: userId, communityId: communityId },
    });
    if (!isManager) {
      throw new UnauthorizedException(MESSAGES.COMMUNITY.UPDATELOGO.UNAUTHORIZED);
    }
    //등록할 이미지가 없는 경우
    if(!imageUrl){
      throw new BadRequestException(MESSAGES.COMMUNITY.UPDATELOGO.BAD_REQUEST)
    }
    await this.communityRepository.update(
      { communityId: communityId },
      { communityLogoImage: imageUrl },
    );
    const updatedData = await this.communityRepository.findOne({
      where: { communityId: communityId },
      select: { communityName: true, communityLogoImage: true },
    });

    return {
      status: HttpStatus.ACCEPTED,
      message: MESSAGES.COMMUNITY.UPDATELOGO.SUCCEED,
      data: updatedData,
    };
  }

  async updateCover(userId: number, communityId: number, imageUrl: string) {
    //매니저 이외의 접근일 경우
    const isManager = await this.managerRepository.findOne({
      where: { userId: userId, communityId: communityId },
    });
    if (!isManager) {
      throw new UnauthorizedException(MESSAGES.COMMUNITY.UPDATECOVER.UNAUTHORIZED);
    }
    if(!imageUrl){
      throw new BadRequestException(MESSAGES.COMMUNITY.UPDATECOVER.BAD_REQUEST)
    }
    await this.communityRepository.update(
      { communityId: communityId },
      { communityCoverImage: imageUrl },
    );
    const updatedData = await this.communityRepository.findOne({
      where: { communityId: communityId },
      select: { communityName: true, communityCoverImage: true },
    });

    return {
      status: HttpStatus.ACCEPTED,
      message: MESSAGES.COMMUNITY.UPDATECOVER.SUCCEED,
      data: updatedData,
    };
  }
}
