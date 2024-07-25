import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateCommunityDto } from './dto/create-community.dto';
import { UpdateCommunityDto } from './dto/update-community.dto';
import { Community } from './entities/community.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommunityUser } from './entities/communityUser.entity';

@Injectable()
export class CommunityService {
  constructor(
    @InjectRepository(Community)
    private readonly communityRepository: Repository<Community>,
    @InjectRepository(CommunityUser)
    private readonly communityUserRepository: Repository<CommunityUser>,
  ) {}

  create(createCommunityDto: CreateCommunityDto) {
    return createCommunityDto;
  }

  async assignCommunity(userId: number, communityId: number, nickName: string) {
    const assignData = await this.communityUserRepository.save({
      userId,
      communityId,
      nickName: '와',
    });
    console.log("------------")
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

  async findAll(myCommunities: number | null) {
    return myCommunities;
  }

  findOne(id: number) {
    return `This action returns a #${id} community`;
  }

  update(id: number, updateCommunityDto: UpdateCommunityDto) {
    return `This action updates a #${updateCommunityDto} community`;
  }

  remove(id: number) {
    return `This action removes a #${id} community`;
  }
}
