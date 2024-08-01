import { Injectable, NotFoundException } from '@nestjs/common';
import NodeMediaServer from 'node-media-server';
import { LiveTypes } from './types/live-types.enum';
import Crypto from 'crypto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Community } from 'src/community/entities/community.entity';
import { CommunityUser } from 'src/community/entities/communityUser.entity';
import { User } from 'src/user/entities/user.entity';
import { Artist } from 'src/admin/entities/artist.entity';
import _ from 'lodash';
import { Live } from './entities/live.entity';
import { LiveRecordings } from './entities/live-recordings.entity';

@Injectable()
export class LiveService {
  constructor(
    @InjectRepository(Community)
    private readonly communityRepository: Repository<Community>,
    @InjectRepository(CommunityUser)
    private readonly communityUserRepository: Repository<CommunityUser>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Artist)
    private readonly artistsRepository: Repository<Artist>,
    @InjectRepository(Live)
    private readonly liveRepository: Repository<Live>,
    @InjectRepository(LiveRecordings)
    private readonly liveRecordingRepository: Repository<LiveRecordings>,
  ) {}

  async createLive(userId: number, title: string, liveType: LiveTypes) {
    // userId로 커뮤니티아티인지 확인 + 어느 커뮤니티인지 조회
    // 원래 이건데 엔티티 변경이 안됐음
    // const communityUser = await this.communityUserRepository.findOne({
    //   where: {
    //     userId,
    //   },
    //   relations: {
    //     community: true,
    //     artists: true,
    //   },
    // });
    const artist = await this.artistsRepository.findOne({
      where: {
        userId,
      },
    });
    if (_.isNil(artist)) {
      throw new NotFoundException({
        // 아닌가 unauthorized 에러를 보내야되나
        status: 404,
        message: '아티스트 회원 정보를 찾을 수 없습니다.',
      });
    }
    // 키는 어떻게 발급할지? 랜덤키?
    const liveUrlKey = Crypto.randomBytes(32).toString('base64');
    const live = await this.liveRepository.save({
      communityId: artist.communityId,
      artistId: artist.artistId,
      title,
      liveType,
      liveUrlKey,
    });
    // 커뮤니티ID, 아티스트(회원?)ID, 제목, 키 저장하는 테이블 필요할듯
    return {
      live,
    };
  }

  async findAllLives(communityId: number) {
    const lives = await this.liveRepository.find({
        where: {
            communityId,
        }
    })
    return lives;
  }

  async watchLive(liveId: number) {
    return '..????'
  }

  async watchRecordedLive(liveId: number) {
    const liveRecording = await this.liveRecordingRepository.findOne({
        where: {
            liveId,
        }
    })
    return '..????'
  }

}
