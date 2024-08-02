import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Manager } from '../entities/manager.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Community } from './../../community/entities/community.entity';
import { CommunityUser } from 'src/community/entities/communityUser.entity';
@Injectable()
export class AdminManagerService {
  constructor(
    @InjectRepository(Manager)
    private readonly managerRepository: Repository<Manager>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Community)
    private readonly communityRepository: Repository<Community>,
    @InjectRepository(CommunityUser)
    private readonly communityUserRepository: Repository<CommunityUser>,
  ) {}

  // 매니저 생성
  async createManager(createManagerDto) {
    const { communityId, userId, managerNickname } = createManagerDto;
    //만약 해당 커뮤니티가 없다면 false반환
    const existedCommunity = await this.communityRepository.findOneBy({
      communityId,
    });
    if (!existedCommunity)
      throw new NotFoundException('해당 커뮤니티가 존재하지 않습니다.');
    //만약 해당 유저가 없다면 false 반환
    const existedUser = await this.userRepository.findOneBy({
      userId,
    });
    if (!existedUser)
      throw new NotFoundException('해당 유저가 존재하지 않습니다.');
    //이미 user_id로 가입된 매니저라면 false반환
    const exsitedManager = await this.managerRepository.findOneBy({
      managerNickname,
    });
    if (exsitedManager) throw new ConflictException('이미 가입된 유저 입니다.');

    const manager = await this.managerRepository.save({
      communityId,
      userId,
      managerNickname,
    });

    // 매니저가 해당 그룹의 커뮤니티 가입
    const communityUser = await this.communityUserRepository.save({
      userId,
      communityId,
      nickName: managerNickname,
    });

    return manager;
  }

  // 매니저 삭제
  async deleteManager(managerId: number) {
    // 해당 매니저 아이디가 없다면 false 반환
    const existedManagewr = await this.managerRepository.findOneBy({
      managerId,
    });
    if (!existedManagewr)
      throw new NotFoundException('해당 매니저가 없습니다.');

    // 해당 매니저 삭제 로직
    await this.managerRepository.delete({ managerId });
    return true;
  }
}
