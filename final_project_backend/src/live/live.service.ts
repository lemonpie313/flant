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
  private readonly nodeMediaServer: NodeMediaServer;

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
  ) {
    // 근데 포트번호 이런것들도 .env로 관리하는게 나을듯...
    const liveConfig = {
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
          {
            app: 'live',
            mp4: true,
            mp4Flags: '[movflags=frag_keyframe+empty_moov]',
          },
        ],
      },
    };
    this.nodeMediaServer = new NodeMediaServer(liveConfig);
  }

  onModuleInit() {
    this.nodeMediaServer.run();
    this.nodeMediaServer.on(
      'prePublish',
      async (id: string, streamPath: string) => {
        const session = this.nodeMediaServer.getSession(id);

        const streamKey = streamPath.split('/live/')[1];

        const live = await this.liveRepository.findOne({
          where: {
            streamKey,
          },
        });
        console.log(live);
        if (_.isNil(live)) {
          session.reject((reason: string) => {
            console.log(reason);
          });
        }
        const time = new Date();
        const diff = (Math.abs(time.getTime() - live.createdAt.getTime() - (1000*60*60*9)) / 1000);
        if (diff > 60) {
          session.reject((reason: string) => {
            console.log(reason);
          });
        }
      },
    );
  }

  async createLive(userId: number, title: string, liveType: LiveTypes) {
    // userId로 커뮤니티아티인지 확인 + 어느 커뮤니티인지 조회
    // const communityUser = await this.communityUserRepository.findOne({
    //   where: {
    //     userId,
    //   },
    //   relations: {
    //     community: true,
    //     artists: true,
    //   },
    // });
    // const artist = await this.artistsRepository.findOne({
    //   where: {
    //     userId,
    //   },
    // });
    // if (_.isNil(artist)) {
    //   throw new NotFoundException({
    //     // 아닌가 unauthorized 에러를 보내야되나
    //     status: 404,
    //     message: '아티스트 회원 정보를 찾을 수 없습니다.',
    //   });
    // }

    // 키 발급
    const streamKey = Crypto.randomBytes(20).toString('hex');
    const live = await this.liveRepository.save({
      communityId: 1, //artist.communityId,
      artistId: 1, //artist.artistId,
      title,
      liveType,
      streamKey,
    });
    // 커뮤니티ID, 아티스트(회원?)ID, 제목, 키 저장하는 테이블 필요할듯
    return live;
  }

  async findAllLives(communityId: number) {
    const lives = await this.liveRepository.find({
      where: {
        communityId,
      },
    });
    return lives;
  }

  async watchLive(liveId: number) {
    const live = await this.liveRepository.findOne({
      where: {
        liveId,
      },
    });
    if (_.isNil(live)) {
      throw new NotFoundException({
        status: 404,
        message:
          '해당 라이브가 존재하지 않습니다.',
      });
    }
    return {
      liveHls: `http://localhost:8000/live/${live.streamKey}/index.m3u8`,
    };
  }
}
