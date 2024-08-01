import { Module } from '@nestjs/common';
import { CommunityService } from './community.service';
import { CommunityController } from './community.controller';
import { Community } from './entities/community.entity';
import { CommunityUser } from './entities/communityUser.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Manager } from 'src/admin/entities/manager.entity';
import { Artist } from 'src/admin/entities/artist.entity';
import { NotificationService } from 'src/notification/notification.service';
import { User } from 'src/user/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Community, CommunityUser, Manager, User, Artist]),
  ],
  controllers: [CommunityController],
  providers: [CommunityService, NotificationService],
})
export class CommunityModule {}
