import {
  Body,
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

  @Post('/')
  async createMembership(
    @Request() req,
    @Query('communityId') communityId: number,
  ) {
    const membership = await this.membershipService.createMembership(
      req.userId,
      communityId,
    );
    return {
      status: HttpStatus.CREATED,
      message: '멤버십 가입이 완료되었습니다.',
      data: membership,
    };
  }

  @Get('/')
  async findAllMembership(@Request() req) {
    const memberships = await this.membershipService.findAllMembership(
      req.userId,
    );
    return {
      status: HttpStatus.OK,
      message: '멤버십 가입 내역 조회가 완료되었습니다.',
      data: memberships,
    };
  }
}
