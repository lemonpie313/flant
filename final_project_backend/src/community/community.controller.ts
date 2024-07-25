import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CommunityService } from './community.service';
import { CreateCommunityDto } from './dto/create-community.dto';
import { UpdateCommunityDto } from './dto/update-community.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('communities')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('v1/community')
export class CommunityController {
  constructor(private readonly communityService: CommunityService) {}

  @Post()
  create(@Body() createCommunityDto: CreateCommunityDto) {
    return this.communityService.create(createCommunityDto);
  }

  @Post(':communityId/assign')
  assignCommunity(
    @Request() req,
    @Param('communityId') communityId: number,
    @Body() nickName: any,
  ) {
    return this.communityService.assignCommunity(req.user.userId, communityId, nickName.nickName);
  }

  @Get()
  findAll(@Query('myCommunities') myCommunities: number | null) {
    return this.communityService.findAll(myCommunities);
  }

  @Get(':communityId')
  findOne(@Param('communityId') communityId: number) {
    return this.communityService.findOne(+communityId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCommunityDto: UpdateCommunityDto,
  ) {
    return this.communityService.update(+id, updateCommunityDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.communityService.remove(+id);
  }
}
