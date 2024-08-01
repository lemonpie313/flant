import { Injectable } from '@nestjs/common';
import NodeMediaServer from 'node-media-server';
import { LiveTypes } from './types/live-types.enum';
import Crypto from 'crypto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Community } from 'src/community/entities/community.entity';
import { CommunityUser } from 'src/community/entities/communityUser.entity';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class LiveService {
  constructor(
    @InjectRepository(Community)
    private readonly communityRepository: Repository<Community>,
    @InjectRepository(CommunityUser)
    private readonly communityUserRepository: Repository<CommunityUser>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  private config = {
    rtmp: {
      port: 1935,
      chunk_size: 60000,
      gop_cache: true,
      ping: 30,
      ping_timeout: 60,
    },
    http: {
      port: 8000,
      mediaroot: '../media',
      allow_origin: '*',
    },
    trans: {
      ffmpeg:
        '/Users/82104/Downloads/ffmpeg-7.0.1-essentials_build/ffmpeg-7.0.1-essentials_build/bin/ffmpeg.exe',
      tasks: [
        {
          app: 'live',
          hls: true,
          hlsFlags: '[hls_time=2:hls_list_size=3:hls_flags=delete_segments]',
          hlsKeep: true, // to prevent hls file delete after end the stream
        },
      ],
    },
  };

  runLiveServer() {
    const nodeMediaServer = new NodeMediaServer(this.config);
    nodeMediaServer.run();
    return '미디어서버 실행';
  }

  async createLive(userId: number, title: string, type: LiveTypes) {
    // userId로 커뮤니티아티인지 확인 + 어느 커뮤니티인지 조회
    const communityUser = await this.communityUserRepository.findOne({
      where: {
        userId,
      },
      relations: {
        community: true,
      },
    });
    // 키는 어떻게 발급할지? 랜덤키?
    const urlKey = Crypto.randomBytes(32).toString('base64');
    console.log(urlKey);
    // 커뮤니티ID, 아티스트(회원?)ID, 제목, 키 저장하는 테이블 필요할듯
    return {
      urlKey,
    };
  }
}
