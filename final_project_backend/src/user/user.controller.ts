import {
  Controller,
  Get,
  UseGuards,
  Request,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  /**
   * 내정보조회
   * @param req
   * @returns
   */
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get('/me')
  async findOne(@Request() req) {
    const data = await this.userService.findMe(req.user.id);

    return {
      statusCode: HttpStatus.OK,
      message: `내 정보 조회에 성공했습니다.`,
      data,
    };
  }
}
