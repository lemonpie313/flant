import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Manager } from 'src/admin/entities/manager.entity';
import { Media } from './entities/media.entity';
import { MediaFile } from './entities/media-file.entity';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Media, MediaFile, Manager]),
  ],
  controllers: [MediaController],
  providers: [MediaService],
})
export class MediaModule {}
