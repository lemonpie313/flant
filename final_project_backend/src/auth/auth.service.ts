import { Injectable, BadRequestException, Request } from '@nestjs/common';
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
import { Res } from '@nestjs/common';
import { Response } from 'express';
import { hash } from 'bcrypt';
import { Refreshtoken } from './entities/refresh-token.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    @InjectRepository(Refreshtoken)
    private readonly refreshtokenRepository: Repository<Refreshtoken>,
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
      throw new BadRequestException('이미 가입된 이메일이 있습니다.');

    // 비밀번호와 비밀번호 확인이랑 일치하는 지
    const isPasswordMatched = password === passwordConfirm;
    if (!isPasswordMatched) {
      throw new BadRequestException(
        '비밀번호와 비밀번호 확인이 서로 일치하지 않습니다.',
      );
    }
    // 비밀번호가 Null값일 때, False 반환
    if (!password) throw new BadRequestException('비밀번호를 입력해주세요');

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
  async signIn(userId: number, @Res({ passthrough: true }) res: Response) {
    const { accessToken, ...accessOption } = this.createAccessToken(userId);
    const { refreshToken, ...refreshOption } = this.createRefreshToken(userId);

    await this.setCurrentRefreshToken(refreshToken, accessToken, userId);

    res.cookie('Authentication', accessToken, accessOption);
    res.cookie('Refresh', refreshToken, refreshOption);

    return { accessToken, refreshToken };
  }

  //로그아웃
  async signOut(req) {
    const { accessOption, refreshOption } = this.getCookiesForLogOut();

    await this.removeRefreshToken(req.user.userId);

    return { accessOption, refreshOption };
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
        '구글 소셜을 통해 회원가입한 사용자는 비밀번호를 설정해주세요',
      );

    if (!user || !isPasswordMatched) {
      return null;
    }

    return { id: user.userId };
  }

  //구글 로그인
  async googleLogin(req) {
    if (!req.user) {
      return 'No user from google';
    }
    // 만약 유저테이블에서 같은 이메일이 있다면 false반환
    const existedUser = await this.userRepository.findOneBy({
      email: req.user.email,
    });
    if (existedUser)
      throw new BadRequestException(
        '이미 회원가입된 계정입니다. 다른 방법으로 로그인해주세요.',
      );

    // 이곳에 유저테이블과 연결지어서 생성
    const user = await this.userRepository.save({
      name: req.user.firstName + req.user.lastName,
      email: req.user.email,
      password: null,
      profileImage: req.user.pircture,
      provider: UserProvider.Google,
    });

    const accessToken = await this.createAccessToken(user.userId);
    return accessToken;
  }

  // accesstoken 생성
  createAccessToken(userId: number) {
    const payload = { id: userId };
    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: this.configService.get<string>('JWT_EXPIRES_IN'),
    });
    // accesstoken을 쿠키에 담아 클라이언트에 전달하기 위함
    return {
      accessToken: accessToken,
      domain: 'localhost', // 추후 도메인 수정 할 것.
      path: '/',
      httpOnly: true, // 클라이언트 측 스크맅브에서 쿠키에 접근할 수 없어 보안 강화
      maxAge: Number(this.configService.get('JWT_EXPIRES_IN')) * 1000,
    };
  }
  // refreshtoken 생성
  createRefreshToken(userId: number) {
    const payload = { id: userId };
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('REFRESH_SECRET'),
      expiresIn: this.configService.get<string>('REFRESH_TOKEN_EXPIRES_IN'),
    });
    return {
      refreshToken: refreshToken,
      domain: 'localhost', // 추후 도메인 수정 할 것.
      path: '/',
      httpOnly: true,
      maxAge: Number(this.configService.get('REFRESH_TOKEN_EXPIRES_IN')) * 1000,
    };
  }

  // 로그아웃시 사용
  getCookiesForLogOut() {
    return {
      accessOption: {
        domain: 'localhost',
        path: '/',
        httpOnly: true,
        maxAge: 0,
      },
      refreshOption: {
        domain: 'localhost',
        path: '/',
        httpOnly: true,
        maxAge: 0,
      },
    };
  }

  // refreshtoken 데이터베이스에 저장
  async setCurrentRefreshToken(
    refreshToken: string,
    accessToken: string,
    userId: number,
  ) {
    // refreshToken 암호화
    const currentHashedRefreshToken = await hash(refreshToken, 10);
    const updateContent = { refreshtoken: currentHashedRefreshToken };
    // User가 RefreshToken을 가지고 있는지 확인
    const existedRefreshToken = await this.refreshtokenRepository.findOneBy({
      userId,
    });
    // 만약 있다면
    if (existedRefreshToken) {
      await this.refreshtokenRepository.update(userId, updateContent);
    } else {
      //만약 없다면
      await this.refreshtokenRepository.save({
        userId,
        accessToken,
        refreshtoken: currentHashedRefreshToken,
        // expires_at은 어떻게 넣지...
      });
    }
  }

  // refreshtoken이 유효한지
  async getUserIfRefreshTokenMatches(refreshToken: string, userId: number) {
    const user = await this.refreshtokenRepository.findOneBy({ userId });
    const isRefreshTokenMatching = bcrypt.compareSync(
      refreshToken,
      user.refreshtoken,
    );

    if (isRefreshTokenMatching) {
      return user;
    }
  }

  // refreshtoken 삭제
  async removeRefreshToken(userId: number) {
    return await this.refreshtokenRepository.update(userId, {
      refreshtoken: null,
    });
  }
}
