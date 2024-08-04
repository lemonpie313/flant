import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserProvider } from 'src/user/types/user-provider.type';
import { BADNAME } from 'dns';
import { MESSAGES } from 'src/constants/message.constant';
@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  // 회원가입
  async signUp({
    email,
    password,
    passwordConfirm,
    name,
    profileImage,
  }: SignUpDto) {
    // 기존 이메일로 가입된 이력이 있을 경우 False
    const existedEmail = await this.userRepository.findOneBy({ email });
    if (existedEmail)
      throw new BadRequestException(MESSAGES.AUTH.COMMON.DUPLICATED);

    // 비밀번호가 Null값일 때, False 반환
    if (!password)
      throw new BadRequestException(MESSAGES.AUTH.COMMON.PASSWORD.REQUIRED);

    // 비밀번호와 비밀번호 확인이랑 일치하는 지
    const isPasswordMatched = password === passwordConfirm;
    if (!isPasswordMatched) {
      throw new BadRequestException(
        MESSAGES.AUTH.COMMON.PASSWORD_CONFIRM.NOT_MATCHED_WITH_PASSWORD,
      );
    }

    // 비밀번호 뭉개기
    const hashRounds = this.configService.get<number>('PASSWORD_HASH');
    const hashedPassword = bcrypt.hashSync(password, hashRounds);

    const user = await this.userRepository.save({
      email,
      password: hashedPassword,
      name,
      profileImage,
    });
    delete user.password;

    return user;
  }

  // 로그인
  signIn(userId: number) {
    const payload = { id: userId };
    const accessToken = this.jwtService.sign(payload);

    return { accessToken };
  }

  async validateUser({ email, password }: SignInDto) {
    const user = await this.userRepository.findOne({
      where: { email },
      select: { userId: true, password: true },
    });
    const isPasswordMatched = bcrypt.compareSync(
      password,
      user?.password ?? '',
    );

    // 구글 소셜 로그인 AND 비밀번호가 NULL값 = 사용자가 비밀번호를 따로 설정하지 않음 = 일반 로그인 불가능
    if (user.provider == UserProvider.Google && !user.password)
      throw new BadRequestException(
        MESSAGES.AUTH.COMMON.OAUTH_GOOGLE.PASSWORD.REQUIRED,
      );

    if (!user || !isPasswordMatched) {
      return null;
    }

    return { id: user.userId };
  }

  //구글 로그인
  async googleLogin(req) {
    if (!req.user) {
      return MESSAGES.AUTH.COMMON.OAUTH_GOOGLE.NOT_FOUND;
    }

    // 만약 유저테이블에서 같은 이메일이 있다면 false반환
    const existedUser = await this.userRepository.findOneBy({
      email: req.user.email,
    });
    if (existedUser)
      throw new BadRequestException(MESSAGES.AUTH.COMMON.OAUTH.DUPLICATED);

    // 이곳에 유저테이블과 연결지어서 생성
    const user = await this.userRepository.save({
      name: req.user.firstName + req.user.lastName,
      email: req.user.email,
      password: null,
      profileImage: req.user.pircture,
      provider: UserProvider.Google,
    });

    const { accessToken } = await this.signIn(user.userId);
    return accessToken;
  }
}
