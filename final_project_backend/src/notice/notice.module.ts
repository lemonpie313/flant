import { Module } from '@nestjs/common';
import { NoticeService } from './notice.service';
import { NoticeController } from './notice.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notice } from './entities/notice.entity';
import { NoticeImage } from './entities/notice-image.entity';
import { Manager } from 'src/admin/entities/manager.entity';
import { MulterModule } from '@nestjs/platform-express';
import { noticeImageUploadFactory } from 'src/factory/notice-image-upload.factory';

@Module({
  imports: [
    MulterModule.registerAsync({
      useFactory: noticeImageUploadFactory,
    }),
    TypeOrmModule.forFeature([Notice, NoticeImage, Manager]),
  ],
  controllers: [NoticeController],
  providers: [NoticeService],
})
export class NoticeModule {}
