import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Artist } from '../entities/artist.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Community } from './../../community/entities/community.entity';
import { CommunityUser } from 'src/community/entities/communityUser.entity';
@Injectable()
export class AdminArtistService {
  constructor(
    @InjectRepository(Artist)
    private readonly artistRepository: Repository<Artist>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Community)
    private readonly communityRepository: Repository<Community>,
    @InjectRepository(CommunityUser)
    private readonly communityUserRepository: Repository<CommunityUser>,
  ) {}
  // 아티스트 생성
  async createArtist(createArtistDto) {
    const { communityId, userId, artistNickname } = createArtistDto;
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
    //이미 user_id로 가입된 아티스트라면 false반환
    const existedArtist = await this.artistRepository.findOneBy({
      artistNickname,
    });
    if (existedArtist) throw new ConflictException('이미 가입된 유저 입니다.');

    const artist = await this.artistRepository.save({
      communityId,
      userId,
      artistNickname,
    });

    // 아티스트가 해당 그룹의 커뮤니티 가입
    const communityUser = await this.communityUserRepository.save({
      userId,
      communityId,
      nickName: artistNickname,
    });

    return artist;
  }

  // 아티스트 삭제
  async deleteArtist(artistId: number) {
    // 해당 아티스트 아이디가 없다면 false 반환
    const existedArtist = await this.artistRepository.findOneBy({ artistId });
    if (!existedArtist)
      throw new NotFoundException('해당 아티스트가 없습니다.');

    // 해당 아티스트 삭제 로직
    await this.artistRepository.delete({ artistId });
    return true;
  }
}
