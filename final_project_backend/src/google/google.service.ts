import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { UserProvider } from 'src/user/types/user-provider.type';
import { Repository } from 'typeorm';

@Injectable()
export class GoogleService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}
  async googleLogin(req) {
    if (!req.user) {
      return 'No user from google';
    }
    // 이곳에 유저테이블과 연결지어서 생성.
    const user = await this.userRepository.save({
      name: req.user.firstName + req.user.lastName,
      email: req.user.email,
      password: null,
      profileImage: req.user.pircture,
      provider: UserProvider.Google,
    });

    return user;
  }
}
