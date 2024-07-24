import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { User } from 'src/user/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { Artist } from './entities/artist.entity';
import { Manager } from './entities/manager.entity';
import { Community } from 'src/community/entities/community.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([User, Artist, Manager, Community]),
    AuthModule,
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
