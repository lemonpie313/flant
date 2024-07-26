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
<<<<<<< HEAD
import { MerchandiseModule } from './merchandise/merchandise.module';
import { FormModule } from './form/form.module';
=======
import { CommunityModule } from './community/community.module';
import { AdminModule } from './admin/admin.module';
import { MembershipModule } from './membership/membership.module';
import { CommentModule } from './comment/comment.module'; // CommentModule 추가
import { ScheduleModule } from '@nestjs/schedule';
>>>>>>> 85ee0eac9956f89c33e1255c254ce48716298338

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: configModuleValidationSchema,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync(typeOrmModuleOptions),
    ProductModule,
    OrderModule,
    AuthModule,
    UserModule,
<<<<<<< HEAD
    MerchandiseModule,
    FormModule,
=======
    CommunityModule,
    AdminModule,
    MembershipModule,
    CommentModule, // CommentModule 추가
>>>>>>> 85ee0eac9956f89c33e1255c254ce48716298338
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
