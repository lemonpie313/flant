import { Module } from '@nestjs/common';
import { GoogleService } from './google.service';
import { GoogleController } from './google.controller';
import { GoogleStrategy } from './strategy/google.strategy';
import { ConfigModule } from '@nestjs/config';
import { configModuleGoogleValidationSchema } from './../configs/google-env-validation.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: configModuleGoogleValidationSchema,
    }),
    TypeOrmModule.forFeature([User]),
    AuthModule,
  ],
  controllers: [GoogleController],
  providers: [GoogleService, GoogleStrategy],
})
export class GoogleModule {}
