import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import NodeMediaServer from 'node-media-server';
import { LiveTypes } from './types/live-types.enum';
import Crypto from 'crypto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Community } from 'src/community/entities/community.entity';
import { CommunityUser } from 'src/community/community-user/entities/communityUser.entity';
import { User } from 'src/user/entities/user.entity';
import { Artist } from 'src/admin/entities/artist.entity';
import _ from 'lodash';
import { Live } from './entities/live.entity';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import fs from 'fs';
import path from 'path';

@Injectable()
export class LiveService {
  private readonly nodeMediaServer: NodeMediaServer;
  private s3Client: S3Client;
  constructor(
    private configService: ConfigService,
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
  ) {
    // AWS S3 클라이언트 초기화
    this.s3Client = new S3Client({
      region: process.env.AWS_BUCKET_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });

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
        mediaroot: path.join(__dirname, '../../media'),
        webroot: './www',
        allow_origin: '*',
      },
      // https: {
      //   port: 8443,
      //   // key: './key.pem',
      //   // cert: './cert.pem',
      // },
      trans: {
        ffmpeg: '/usr/bin/ffmpeg',
        //'/Users/82104/Downloads/ffmpeg-7.0.1-essentials_build/ffmpeg-7.0.1-essentials_build/bin/ffmpeg.exe',
        tasks: [
          {
            app: 'live',
            ac: 'aac',
            hls: true,
            hlsFlags: '[hls_time=2:hls_list_size=3:hls_flags=delete_segments]',
            hlsKeep: true, // to prevent hls file delete after end the stream
            ffmpegParams: '-loglevel debug -report', // FFmpeg 로그 기록
            // dash: true,
            // dashFlags: '[f=dash:window_size=3:extra_window_size=5]',
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
    // 서버 실행하면서 미디어서버도 같이 실행
    this.nodeMediaServer.run();

    // 방송 전 키값이 유효한지 검증 (따로 암호화 없음, 유효기간만 검증함)
    this.nodeMediaServer.on(
      'prePublish',
      async (id: string, streamPath: string) => {
        console.log(
          '-----------------------방송시작직전--------------------------',
        );
        const session = this.nodeMediaServer.getSession(id);
        const streamKey = streamPath.split('/live/')[1];

        const live = await this.liveRepository.findOne({
          where: {
            streamKey,
          },
        });
        console.log('----------------foundData----------------');
        console.log(live);
        if (!live) {
          console.log('-------------에러------------');
          session.reject((reason: string) => {
            console.log(reason);
            console.log('라이브 스트림키를 확인해주세요.');
          });
        }
        const time = new Date();
        const diff = Math.abs(time.getTime() - live.createdAt.getTime()) / 1000;
        if (diff > 6000) {
          // 1분 이내에 스트림키 입력 후 방송 시작이 돼야함
          console.log('-------------에러------------');
          session.reject((reason: string) => {
            console.log(reason);
            console.log('라이브 스트림키의 유효기간이 만료되었습니다.');
          });
        }
        console.log('------------------------방송시작?------------------');
      },
    );

    // 방송 종료 시 s3에 업로드
    this.nodeMediaServer.on(
      'donePublish',
      async (id: string, streamPath: string) => {
        console.log('---------------------------방송종료?------------------');
        const streamKey = streamPath.split('/live/')[1];
        const live = await this.liveRepository.findOne({
          where: { streamKey },
        });

        const liveDirectory = path.join(
          __dirname,
          '../../media/live',
          streamKey,
        );
        console.log(
          `-------------------------------Reading directory: ${liveDirectory}`,
        );

        if (!fs.existsSync(liveDirectory)) {
          console.error('Live directory does not exist:', liveDirectory);
          return;
        }

        const files = fs.readdirSync(liveDirectory);
        console.log('Files in directory:', files);

        const fileName = files.find((file) => path.extname(file) === '.mp4');

        if (!fileName) {
          console.error('No .mp4 file found in directory:', liveDirectory);
          return;
        }

        const filePath = path.join(liveDirectory, fileName);
        console.log(
          '-------------------------------------------------Reading file:',
          filePath,
        );

        try {
          const file = fs.readFileSync(filePath);
          const liveVideoUrl = await this.liveRecordingToS3(
            fileName,
            file,
            'mp4',
          );
          await this.cleanupStreamFolder(streamKey);
          console.log(
            '----------------------repository 업데이트-----------------------',
          );
          await this.liveRepository.update(
            { liveId: live.liveId },
            { liveVideoUrl },
          );
        } catch (error) {
          console.error('Error handling live stream file:', error);
        }
      },
    );
  }

  async liveRecordingToS3(
    fileName: string, // 업로드될 파일의 이름
    file, // 업로드할 파일
    ext: string, // 파일 확장자
  ) {
    console.log(
      '-------------------------------------종료후업로드전-----------',
    );
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `liveRecordings/${fileName}`,
      Body: file,
      ContentType: `video/${ext}`,
    });

    try {
      await this.s3Client.send(command);
      // 업로드된 이미지의 URL 반환
      return `https://s3.${process.env.AWS_BUCKET_REGION}.amazonaws.com/${process.env.AWS_BUCKET_NAME}/${fileName}`;
    } catch (error) {
      console.error('Error uploading file to S3:', error);
      throw error; // 에러를 상위 함수로 전달
    }  }

  async cleanupStreamFolder(streamKey: string) {
    const folderPath = path.join(__dirname, '../../media/live', streamKey);
    console.log('folderPath: ' + folderPath);
    if (fs.existsSync(folderPath)) {
      for (const file of fs.readdirSync(folderPath)) {
        const curPath = path.join(folderPath, file);
        fs.unlinkSync(curPath);
      }
      fs.rmdirSync(folderPath);
    }
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
    //     status: 404,
    //     message: '아티스트 회원 정보를 찾을 수 없습니다.',
    //   });
    // }
    console.log(
      '-----------------------------------------------------------------',
    );
    // 키 발급
    const streamKey = Crypto.randomBytes(20).toString('hex');
    const live = await this.liveRepository.save({
      communityId: 1, //artist.communityId,
      artistId: 1, //artist.artistId,
      title,
      liveType,
      streamKey,
    });
    return { liveServer: 'rtmp://flant.club/live', ...live };
    //return { liveServer: 'rtmp://localhost/live', ...live };
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
      // relations: {
      //   community: true,
      //   artist: true,
      // }
    });
    if (_.isNil(live)) {
      throw new NotFoundException({
        status: 404,
        message: '해당 라이브가 존재하지 않습니다.',
      });
    }
    return {
      liveId: live.liveId,
      communityId: live.communityId,
      // communityName: live.communityId.communityName,
      // communityLogoImage: live.community.communityLogoImage,
      artistId: live.artistId,
      // artistNickname: live.artist.artistNickname,
      title: live.title,
      liveHls: `https://localhost:8443/live/${live.streamKey}/index.m3u8`,
      // liveHls: `https://flant.club:8443/live/${live.streamKey}/index.m3u8`,
    };
  }

  async watchRecordedLive(liveId: number) {
    const live = await this.liveRepository.findOne({
      where: {
        liveId,
      },
      // relations: {
      //   community: true,
      //   artist: true,
      // }
    });
    if (_.isNil(live)) {
      throw new NotFoundException({
        status: 404,
        message: '해당 라이브가 존재하지 않습니다.',
      });
    } else if (!live.liveVideoUrl) {
      throw new BadRequestException({
        status: 400,
        message: '해당 라이브는 다시보기로 시청이 불가능합니다.',
      });
    }
    return {
      liveId: live.liveId,
      communityId: live.communityId,
      // communityName: live.communityId.communityName,
      // communityLogoImage: live.community.communityLogoImage,
      artistId: live.artistId,
      // artistNickname: live.artist.artistNickname,
      title: live.title,
      liveVideoUrl: live.liveVideoUrl,
    };
  }
}
