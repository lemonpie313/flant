import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Community } from 'src/community/entities/community.entity';
import { CommunityUser } from 'src/community/entities/communityUser.entity';
import { DataSource, Repository } from 'typeorm';
import { MembershipPayment } from './entities/membership.entity';
import _ from 'lodash';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class MembershipService {
  constructor(
    @InjectRepository(Community)
    private readonly communityRepository: Repository<Community>,
    @InjectRepository(CommunityUser)
    private readonly communityUserRepository: Repository<CommunityUser>,
    @InjectRepository(MembershipPayment)
    private readonly membershipPaymentRepository: Repository<MembershipPayment>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private dataSource: DataSource,
  ) {}

  async createMembership(userId: number, communityId: number) {
    // 유저아이디, 커뮤니티아이디 바탕으로 커뮤니티유저 조회
    const communityUser = await this.communityUserRepository.findOne({
      where: {
        userId,
        communityId,
      },
      // relations: ['community'], >> relation 안돼있음...ㅠㅠ
    });
    console.log('ㅇㅇㅇㅇ');
    if (_.isNil(communityUser)) {
      throw new NotFoundException({
        status: 404,
        message:
          '커뮤니티 가입 정보가 없습니다. 커뮤니티 가입을 먼저 진행해주세요.',
      });
    }
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction('READ UNCOMMITTED');
    try {
      let expiration = new Date();
      expiration.setFullYear(expiration.getFullYear() + 1);
      // 커뮤니티유저 ID > 커뮤니티유저 멤버쉽여부 수정
      await queryRunner.manager.update(
        CommunityUser,
        {
          communityUserId: communityUser.communityUserId,
        },
        {
          membership: true,
        },
      );
      // 커뮤니티유저 ID > 결제내역 저장
      const membershipPayment = this.membershipPaymentRepository.create({
        communityUserId: communityUser.communityUserId,
        expiration,
      });
      await queryRunner.manager.save(MembershipPayment, membershipPayment);

      // 유저ID > 포인트 깎기
      await queryRunner.manager.decrement(User, { userId }, 'points', 20000);
      const user = await this.userRepository.findOne({
        where: {
          user_id: userId,
        },
      });
      await queryRunner.commitTransaction();

      return {
        //커뮤니티 정보를 넣어야되는데..연결이안돼서 일단 보류
        communityUserId: communityUser.communityUserId,
        nickname: communityUser.nickName,
        price: 20000,
        accountBalance: user.point,
      };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async findAllMembership(userId: number) {
    // 유저아이디, 멤버십 가입 여부 바탕으로 커뮤니티 유저 조회
    const communityUser = await this.communityUserRepository.find({
      where: {
        userId,
        membership: true,
      },
      relations: {
        membershipPayment: true,
        // community: true,
      },
    });
    const memberships = communityUser.map((cur) => {
      return {
        membershipPaymentId: cur.membershipPayment.membershipPaymentId,
        createdAt: cur.membershipPayment.createdAt,
        expiration: cur.membershipPayment.expiration,
      };
    });
    return memberships;
  }
}
