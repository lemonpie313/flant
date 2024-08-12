import {
  Controller,
  Param,
  Post,
  UseGuards,
  Request,
  Query,
  HttpStatus,
  Get,
  Body,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { MembershipService } from './membership.service';
import { UserRole } from 'src/user/types/user-role.type';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { MembershipDto } from './dtos/membership.dto';

@ApiTags('membership_payments')
@Controller('v1/membership')
export class MembershipController {
  constructor(private readonly membershipService: MembershipService) {}
  /**
   * 멤버십 결제내역 전체조회 - 어드민
   * @param req
   * @param communityId
   * @returns
   */
  @ApiBearerAuth()
  @Roles(UserRole.Admin)
  @UseGuards(RolesGuard)
  @Get('/payments')
  async findMembershipPayments(
    @Request() req,
    @Body() membershipDto: MembershipDto
  ) {
    const { communityId } = membershipDto;
    const payments =
      await this.membershipService.findMembershipPayments(communityId);
    return {
      status: HttpStatus.OK,
      message: '멤버십 결제내역 전체조회가 완료되었습니다.',
      data: payments,
    };
  }

  /**
   * 멤버십 가입
   * @param req
   * @returns
   */
  @ApiBearerAuth()
  @Roles(UserRole.User)
  @UseGuards(RolesGuard)
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
   * @param req
   * @returns
   */
  @ApiBearerAuth()
  @Roles(UserRole.User)
  @UseGuards(RolesGuard)
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
   * @param req
   * @returns
   */
  @ApiBearerAuth()
  @Roles(UserRole.User)
  @UseGuards(RolesGuard)
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
   * @param req
   * @returns
   */
  @ApiBearerAuth()
  @Roles(UserRole.User)
  @UseGuards(RolesGuard)
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
