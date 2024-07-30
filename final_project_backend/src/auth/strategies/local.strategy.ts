import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserProvider } from 'src/user/types/user-provider.type';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  async validate(email: string, password: string) {
    const userInfo = await this.userRepository.findOneBy({ email });
    if (!userInfo)
      throw new UnauthorizedException('일치하는 인증 정보가 없습니다.');
    // 구글 소셜 로그인 AND 비밀번호가 NULL값 = 사용자가 비밀번호를 따로 설정하지 않음 = 일반 로그인 불가능
    if (userInfo.provider == UserProvider.Google && !userInfo.password)
      throw new BadRequestException(
        '구글 소셜을 통해 회원가입한 사용자는 비밀번호를 설정해주세요',
      );

    const user = await this.authService.validateUser({ email, password });
    if (!user) {
      throw new UnauthorizedException('일치하는 인증 정보가 없습니다.');
    }

    return user;
  }
}
