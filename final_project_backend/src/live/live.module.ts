import { Module } from '@nestjs/common';
import { LiveController } from './live.controller';
import { LiveService } from './live.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Community } from 'src/community/entities/community.entity';
import { CommunityUser } from 'src/community/entities/communityUser.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Community, CommunityUser, User])],
    providers: [LiveService],
    controllers: [LiveController],
  })
export class LiveModule {}
