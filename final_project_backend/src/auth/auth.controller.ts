import {
  Controller,
  Post,
  Body,
  HttpStatus,
  HttpCode,
  UseGuards,
  Get,
  Req,
  Res,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { SignInDto } from './dto/sign-in.dto';
import { Response } from 'express';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { UserInfo } from 'src/util/decorators/user-info.decorator';
import { PartialUser } from 'src/user/interfaces/partial-user.entity';
import { MESSAGES } from 'src/constants/message.constant';

@ApiTags('인증')
@Controller('v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * 회원가입
   * @param signUpDto
   * @returns
   */
  @Post('/sign-up')
  async signUp(@Body() signUpDto: SignUpDto) {
    const data = await this.authService.signUp(signUpDto);

    return {
      statusCode: HttpStatus.CREATED,
      message: MESSAGES.AUTH.SIGN_UP.SECCEED,
      data: data,
    };
  }

  /**
   * 로그인
   * @param req
   * @param signInDto
   * @returns
   */
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @Post('/sign-in')
  async signIn(
    @UserInfo() user: PartialUser,
    @Body() signInDto: SignInDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const data = await this.authService.signIn(user.id, res);

    return {
      statusCode: HttpStatus.OK,
      message: MESSAGES.AUTH.SIGN_IN.SECCEED,
      data,
    };
  }

  /**
   * 구글 로그인
   * @param req
   * @returns
   */
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {}

  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req, @Res() res: Response) {
    const accessToken = await this.authService.googleLogin(req);

    res.redirect(`http://localhost:3000/index.html?token=${accessToken}`);
  }

  /**
   * 로그아웃
   */
  @UseGuards(AuthGuard('jwt-refresh-token'))
  @Post('/sign-out')
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const { accessOption, refreshOption } = await this.authService.signOut(req);

    res.cookie('Authentication', '', accessOption);
    res.cookie('Refresh', '', refreshOption);
    return {
      statusCode: HttpStatus.OK,
      message: '로그아웃에 성공했습니다.',
    };
  }

  /**
   * refreshtoken을 통해 accesstoken발급
   */
  async getAccessToken(
    refreshtoken: string,
    userId: number,
    @Req() req: Request,
  ) {
    const accesstoken = await this.authService.getAccessToken(
      refreshtoken,
      userId,
      req,
    );
  }
}
