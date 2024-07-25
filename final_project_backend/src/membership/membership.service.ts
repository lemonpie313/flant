import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Community } from 'src/community/entities/community.entity';
import { CommunityUser } from 'src/community/entities/communityUser.entity';
import { DataSource, Not, Repository } from 'typeorm';
import { Membership } from './entities/membership.entity';
import _ from 'lodash';
import { User } from 'src/user/entities/user.entity';
import { MembershipPayment } from './entities/membership-payment.entity';

@Injectable()
export class MembershipService {
  constructor(
    @InjectRepository(Community)
    private readonly communityRepository: Repository<Community>,
    @InjectRepository(CommunityUser)
    private readonly communityUserRepository: Repository<CommunityUser>,
    @InjectRepository(Membership)
    private readonly membershipRepository: Repository<Membership>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(MembershipPayment)
    private readonly membershipPaymentRepository: Repository<MembershipPayment>,
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
    if (_.isNil(communityUser)) {
      throw new NotFoundException({
        status: 404,
        message:
          '커뮤니티 가입 정보가 없습니다. 커뮤니티 가입을 먼저 진행해주세요.',
      });
    }
    if (communityUser.membership) {
      throw new ConflictException({
        status: 409,
        message:
          '이미 가입된 멤버십입니다.',
      });
    }
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction('READ UNCOMMITTED');
    try {
      let expiration = new Date();
      expiration.setFullYear(expiration.getFullYear() + 1);
      // 커뮤니티유저 ID > 커뮤니티유저 멤버쉽여부 수정
      // await queryRunner.manager.update(
      //   CommunityUser,
      //   {
      //     communityUserId: communityUser.communityUserId,
      //   },
      //   {
      //     membership: true,
      //   },
      // );

      // 커뮤니티유저 ID > 멤버쉽 추가
      const membership = this.membershipRepository.create({
        communityUserId: communityUser.communityUserId,
        expiration,
      });
      await queryRunner.manager.save(Membership, membership);

      // 결제내역 저장
      const membershipPayment = this.membershipPaymentRepository.create({
        userId,
        price: 20000, // 원래 커뮤니티에서 조회한 결과를 넣어야댐...
      });
      await queryRunner.manager.save(MembershipPayment, membershipPayment);

      // 유저ID > 포인트 깎기
      await queryRunner.manager.decrement(User, { userId }, 'points', 20000);
      const user = await this.userRepository.findOne({
        where: {
          userId,
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
        //membership: true,
        membership: Not(null),
      },
      relations: {
        membership: true,
        // community: true,
      },
    });
    const memberships = communityUser.map((cur) => {
      return {
        membershipPaymentId: cur.membership.membershipId,
        createdAt: cur.membership.createdAt,
        expiration: cur.membership.expiration,
      };
    });
    return memberships;
  }

  async findMembership(membershipId: number) {
    // 유저아이디, 멤버십 가입 여부 바탕으로 커뮤니티 유저 조회
    const communityUser = await this.communityUserRepository.findOne({
      where: {
        membershipId,
      },
      relations: {
        membership: true,
        // community: true,
      },
    });
    if (_.isNil(communityUser)) {
      throw new NotFoundException({
        status: 404,
        message: '해당 멤버십 정보가 없습니다.',
      });
    }

    const membership = {
      communityUserId: communityUser.communityUserId,
      nickname: communityUser.nickName,
      // 커뮤니티(그룹) 정보 추가...
      membershipPaymentId: communityUser.membership.membershipId,
      createdAt: communityUser.membership.createdAt,
      expiration: communityUser.membership.expiration,
    };

    return membership;
  }

  async extendMembership(userId: number, membershipId: number) {
    const membership = await this.membershipRepository.findOne({
      where: {
        membershipId,
      },
    });

    if (_.isNil(membership)) {
      throw new NotFoundException({
        status: 404,
        message: '해당 멤버십 정보가 없습니다.',
      });
    }

    const today = new Date();
    const remaining =
      (membership.expiration.getTime() - today.getTime()) /
      (1000 * 60 * 60 * 24);

    if (remaining > 7) {
      throw new BadRequestException({
        status: 400,
        message: '멤버십 연장은 기간 만료 일주일 전부터 가능합니다.',
      });
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction('READ UNCOMMITTED');

    try {
      let expiration = membership.expiration;
      expiration.setFullYear(expiration.getFullYear() + 1);
      // 커뮤니티유저 ID > 결제내역 저장
      await queryRunner.manager.update(Membership, membershipId, {
        expiration,
      });

      // 유저ID > 포인트 깎기
      await queryRunner.manager.decrement(User, { userId }, 'points', 20000);
      const user = await this.userRepository.findOne({
        where: {
          userId,
        },
      });
      await queryRunner.commitTransaction();

      return {
        //아 정리가 안된다...........
        membershipPaymentId: membership.membershipId,
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
}
