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
import { CommunityUser } from './entities/communityUser.entity';
import { CommunityAssignDto } from './dto/community-assign.dto';
import _ from 'lodash';
import { Manager } from 'src/admin/entities/manager.entity';

@Injectable()
export class CommunityService {
  constructor(
    @InjectRepository(Community)
    private readonly communityRepository: Repository<Community>,
    @InjectRepository(CommunityUser)
    private readonly communityUserRepository: Repository<CommunityUser>,
    @InjectRepository(Manager)
    private readonly managerRepository: Repository<Manager>,
  ) {}

  async create(createCommunityDto: CreateCommunityDto) {
    const createCommunity =
      await this.communityRepository.save(createCommunityDto);
    return {
      status: HttpStatus.CREATED,
      message: '커뮤니티 생성에 성공했습니다.',
      data: createCommunity,
    };
  }

  async assignCommunity(
    userId: number,
    communityId: number,
    nickName: CommunityAssignDto,
  ) {
    const assignData = await this.communityUserRepository.save({
      userId: userId,
      communityId: communityId,
      nickName: nickName.nickName,
    });
    const assignedName = assignData.nickName;
    const findCommunity = await this.communityRepository.findOne({
      where: { communityId: communityId },
    });
    const communityName = findCommunity.communityName;

    const Data = { assignedName, communityName };
    return {
      status: HttpStatus.OK,
      message: '커뮤니티 가입에 성공했습니다.',
      data: Data,
    };
  }

  async findAll() {
    const allCommunities = await this.communityRepository.find({
      select: ['communityLogoImage', 'communityName'],
    });
    return {
      status: HttpStatus.OK,
      message: '모든 커뮤니티 조회에 성공했습니다.',
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
      message: '내 커뮤니티 조회에 성공했습니다.',
      data: myData,
    };
  }

  async findOne(communityId: number) {
    const oneCommunityData = await this.communityRepository.findOne({
      where: { communityId: communityId },
      relations: ['posts', 'post.postimages'],
    });

    return {
      status: HttpStatus.OK,
      message: '내 커뮤니티 조회에 성공했습니다.',
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
      throw new BadRequestException('입력된 수정 사항이 없습니다.');
    }
    //매니저 이외의 접근일 경우
    const isManager = await this.managerRepository.findOne({
      where: { userId: userId, communityId: communityId },
    });
    if (!isManager) {
      throw new UnauthorizedException('커뮤니티 수정 권한이 없습니다');
    }

    await this.communityRepository.update(
      { communityId: communityId },
      {
        communityName: updateCommunityDto.communityName,
        membershipPrice: updateCommunityDto.membershipPrice,
      },
    );
    const updateData = await this.communityRepository.findOne({
      where: { communityId: +communityId },
    });
    return {
      status: HttpStatus.ACCEPTED,
      message: '커뮤니티 수정에 성공했습니다.',
      data: updateData,
    };
  }

  async removeCommunity(userId: number, communityId: number) {
    //매니저 이외의 접근일 경우
    const isManager = await this.managerRepository.findOne({
      where: { userId: userId, communityId: communityId },
    });
    if (!isManager) {
      throw new UnauthorizedException('커뮤니티 수정 권한이 없습니다');
    }

    await this.communityRepository.delete(communityId);

    return {
      status: HttpStatus.OK,
      message: '커뮤니티 삭제에 성공했습니다.',
      data: communityId,
    };
  }
  async updateLogo(userId: number, communityId: number, imageUrl: string){
    //매니저 이외의 접근일 경우
    const isManager = await this.managerRepository.findOne({
      where: { userId: userId, communityId: communityId },
    });
    if (!isManager) {
      throw new UnauthorizedException('커뮤니티 수정 권한이 없습니다');
    }
    //등록할 이미지가 없는 경우
    if(!imageUrl){
      throw new BadRequestException('등록할 이미지를 업로드 해주세요.')
    }
    await this.communityRepository.update(
      { communityId: communityId },
      { communityLogoImage: imageUrl }
    )
    const updatedData = await this.communityRepository.findOne({
      where: { communityId: communityId },
      select: { communityName: true, communityLogoImage: true }})

    return {
      status: HttpStatus.ACCEPTED,
      message: '로고 이미지 수정이 완료되었습니다.',
      data: updatedData,
    }
  }

  async updateCover(userId: number, communityId: number, imageUrl: string){
    //매니저 이외의 접근일 경우
    const isManager = await this.managerRepository.findOne({
      where: { userId: userId, communityId: communityId },
    });
    if (!isManager) {
      throw new UnauthorizedException('커뮤니티 수정 권한이 없습니다');
    }
    if(!imageUrl){
      throw new BadRequestException('등록할 이미지를 업로드 해주세요.')
    }
    await this.communityRepository.update(
      { communityId: communityId },
      { communityCoverImage: imageUrl }
    )
    const updatedData = await this.communityRepository.findOne({
      where: { communityId: communityId },
      select: { communityName: true, communityCoverImage: true }})

    return {
      status: HttpStatus.ACCEPTED,
      message: '커버 이미지 수정이 완료되었습니다.',
      data: updatedData,
  }
}
}
