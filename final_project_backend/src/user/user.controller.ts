import {
  Controller,
  Get,
  UseGuards,
  Request,
  HttpStatus,
  Param,
  Body,
  Patch,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { SearchUserParamsDto } from './dto/search-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DeleteUserDto } from './dto/delete-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}
  /**
   * 내 정보 조회
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

  /**
   * 다른 유저 정보 조회
   * @param userId
   * @returns
   */
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get('/:userId')
  async findUser(@Param() userId: SearchUserParamsDto) {
    const data = await this.userService.findUser(userId.userId);
    return {
      statusCode: HttpStatus.OK,
      message: `${data.name}님 정보 조회에 성공했습니다.`,
      data,
    };
  }

  /**
   * 내 정보 수정
   * @param userId
   * @param updateUserDto
   * @param req
   * @returns
   */
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Patch('/:userId')
  async updateUser(
    @Param() userId: SearchUserParamsDto,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    await this.userService.updateUser(userId.userId, updateUserDto);

    return {
      statusCode: HttpStatus.OK,
      message: `정보 수정에 성공했습니다.`,
    };
  }

  /**
   * 회원 탈퇴
   * @param userId
   * @param deleteUserDto
   * @returns
   */
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Delete('/:userId')
  async deleteUser(
    @Param() userId: SearchUserParamsDto,
    @Body() deleteUserDto: DeleteUserDto,
  ) {
    console.log('hello');
    await this.userService.deleteUser(userId.userId, deleteUserDto.password);

    return {
      statusCode: HttpStatus.OK,
      message: `회원 탈퇴에 성공했습니다.`,
    };
  }
}
