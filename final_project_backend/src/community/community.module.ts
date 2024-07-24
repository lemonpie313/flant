import { Module } from '@nestjs/common';
import { CommunityService } from './community.service';
import { CommunityController } from './community.controller';
import { Community } from './entities/community.entity';
import { CommunityUser } from './entities/communityUser.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Community, CommunityUser])],
  controllers: [CommunityController],
  providers: [CommunityService],
})
export class CommunityModule {}
