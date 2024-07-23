import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SearchUserParamsDto } from './dto/search-user.dto';
@Injectable()
export class UserService {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  // 내 정보 조회
  async findMe(userId: number) {
    const user = await this.userRepository.findOne({
      where: { user_id: userId },
    });
    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    const response = {
      id: user.user_id,
      email: user.email,
      name: user.name,
      profile_image: user.profile_image,
      role: user.role,
    };

    return response;
  }

  // 다른 사람 정보 조회
  async findUser(userId: number) {
    const user = await this.userRepository.findOneBy({
      user_id: userId,
    });
    const response = {
      id: user.user_id,
      email: user.email,
      name: user.name,
      profile_image: user.profile_image,
      role: user.role,
    };

    return response;
  }
}
