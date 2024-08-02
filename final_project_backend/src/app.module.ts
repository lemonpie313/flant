import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { configModuleValidationSchema } from './configs/env-validation.config';
import { typeOrmModuleOptions } from './configs/database.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductModule } from './product/product.module';
import { OrderModule } from './order/order.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { MerchandiseModule } from './merchandise/merchandise.module';
import { FormModule } from './form/form.module';
import { CommunityModule } from './community/community.module';
import { AdminModule } from './admin/admin.module';
import { MembershipModule } from './membership/membership.module';
import { CommentModule } from './comment/comment.module'; // CommentModule 추가
import { ScheduleModule } from '@nestjs/schedule';
import { CartModule } from './cart/cart.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { PostModule } from './post/post.module';
import { LikeModule } from './like/like.module';
<<<<<<< HEAD
import { NoticeModule } from './notice/notice.module';
import { MediaModule } from './media/media.module';
import { LiveModule } from './live/live.module';
=======
>>>>>>> b0fbd47f4f612fae236f34179a17853be0f854a3

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: configModuleValidationSchema,
      envFilePath: '.env',
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../..', 'final_project_frontend'),
    }),
    TypeOrmModule.forRootAsync(typeOrmModuleOptions),
    ProductModule,
    OrderModule,
    AuthModule,
    UserModule,
    MerchandiseModule,
    FormModule,
    CommunityModule,
    AdminModule,
    MembershipModule,
    CommentModule,
    CartModule, // CommentModule 추가
    PostModule,
    LikeModule,
<<<<<<< HEAD
    NoticeModule,
    MediaModule, // CommentModule 추가
    PostModule,
    LiveModule, // CommentModule 추가
=======
>>>>>>> b0fbd47f4f612fae236f34179a17853be0f854a3
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
