import {
  Controller,
  Param,
  Post,
  UseGuards,
  Request,
  Query,
  HttpStatus,
  Get,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { MembershipService } from './membership.service';

@ApiTags('membership_payments')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('v1/membership')
export class MembershipController {
  constructor(private readonly membershipService: MembershipService) {}

  /**
   * 멤버십 가입
   *
   * @returns
   */
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post('/')
  async createMembership(
    @Request() req,
    @Query('communityId') communityId: number,
  ) {
    const membership = await this.membershipService.createMembership(
      req.user.id,
      communityId,
    );
    return {
      status: HttpStatus.CREATED,
      message: '멤버십 가입이 완료되었습니다.',
      data: membership,
    };
  }

  /**
   * 멤버십 가입내역 전체조회
   *
   * @returns
   */
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get('/')
  async findAllMembership(@Request() req) {
    const memberships = await this.membershipService.findAllMembership(
      req.user.id,
    );
    return {
      status: HttpStatus.OK,
      message: '멤버십 가입 내역 조회가 완료되었습니다.',
      data: memberships,
    };
  }

  /**
   * 멤버십 가입내역 상세조회
   *
   * @returns
   */
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get('/:membershipPaymentId')
  async findMembership(
    @Request() req,
    @Param('membershipPaymentId') membershipPaymentId: number,
  ) {
    const membership =
      await this.membershipService.findMembership(membershipPaymentId);
    return {
      status: HttpStatus.OK,
      message: '멤버십 가입 내역 상세조회가 완료되었습니다.',
      data: membership,
    };
  }

  /**
   * 멤버십 연장
   *
   * @returns
   */
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post('/:membershipPaymentId')
  async extendMembership(
    @Request() req,
    @Param('membershipPaymentId') membershipPaymentId: number,
  ) {
    const membership = await this.membershipService.extendMembership(
      req.user.id,
      membershipPaymentId,
    );
    return {
      status: HttpStatus.CREATED,
      message: '멤버십 기한 연장이 완료되었습니다.',
      data: membership,
    };
  }
}
