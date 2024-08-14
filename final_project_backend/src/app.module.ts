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
import { ChatModule } from './chat/chat.module';
import { CartModule } from './cart/cart.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { PostModule } from './post/post.module';
import { LikeModule } from './like/like.module';
import { NoticeModule } from './notice/notice.module';
import { MediaModule } from './media/media.module';
import { LiveModule } from './live/live.module';
import { CommunityUserModule } from './community/community-user/community-user.module';
import { CacheModule } from '@nestjs/cache-manager';
import { RedisClientOptions } from 'redis';
import { redisStore } from 'cache-manager-redis-yet'
import { APP_INTERCEPTOR } from '@nestjs/core';
import { SentryWebhookInterceptor } from './webhook.interceptor';
@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: configModuleValidationSchema,
      envFilePath: '.env',
    }),
    CacheModule.register<RedisClientOptions>({
      store: redisStore,
      password: process.env.REDIS_PASSWORD,
      socket: {
        port: parseInt(process.env.REDIS_PORT),
        host: process.env.REDIS_HOST,
      },
      isGlobal: true,
      ttl: 60 * 1000,
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
    CommentModule, // CommentModule 추가
    CartModule,
    PostModule,
    LikeModule,
    NoticeModule,
    MediaModule,
    PostModule,
    LiveModule,
    CommunityUserModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      // centry가 전역에 사용될수있도록 설정
      provide: APP_INTERCEPTOR,
      useClass: SentryWebhookInterceptor,
    },
  ],
})
export class AppModule {}
