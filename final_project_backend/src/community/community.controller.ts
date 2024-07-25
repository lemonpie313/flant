import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CommunityService } from './community.service';
import { CreateCommunityDto } from './dto/create-community.dto';
import { UpdateCommunityDto } from './dto/update-community.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { CommunityAssignDto } from './dto/community-assign.dto';

@ApiTags('communities')
@Controller('v1/community')
export class CommunityController {
  constructor(private readonly communityService: CommunityService) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(@Request() req, @Body() createCommunityDto: CreateCommunityDto) {
    const userId = req.user.id;
    return await this.communityService.create(+userId, createCommunityDto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post(':communityId/assign')
  async assignCommunity(
    @Request() userId: number,
    @Param('communityId') communityId: number,
    @Body() nickName: CommunityAssignDto,
  ) {
    return await this.communityService.assignCommunity(
      userId,
      communityId,
      nickName,
    );
  }

  @Get()
  async findAll() {
    return await this.communityService.findAll();
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get('my')
  async findMy(@Request() req) {
    const userId = req.user.id;
    return await this.communityService.findMy(userId);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Patch(':communityId')
  async updateCommunity(
    @Request() req,
    @Param('communityId') communityId: number,
    @Body() updateCommunityDto: UpdateCommunityDto,
  ) {
    const userId = req.user.id;
    return await this.communityService.updateCommunity(
      +userId,
      +communityId,
      updateCommunityDto,
    );
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Delete(':communityId')
  remove(@Request() req, @Param('communityId') communityId: number) {
    const userId = req.user.id;
    return this.communityService.removeCommunity(+userId, +communityId);
  }
}
