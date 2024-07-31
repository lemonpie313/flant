import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { PostImage } from './entities/post-image.entity';
import { User } from 'src/user/entities/user.entity';
import { Artist } from 'src/admin/entities/artist.entity';
import { CommunityUser } from 'src/community/entities/communityUser.entity';
import { MulterModule } from '@nestjs/platform-express';
import { postImageUploadFactory } from '../factory/post-image-upload.factory';
import { Manager } from 'src/admin/entities/manager.entity';
import { LikeModule } from 'src/like/like.module';

@Module({
  imports: [
    MulterModule.registerAsync({
      useFactory: postImageUploadFactory,
    }),
    TypeOrmModule.forFeature([
      Post,
      PostImage,
      User,
      Artist,
      CommunityUser,
      Manager,
    ]),
    LikeModule,
  ],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
