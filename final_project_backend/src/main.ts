import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS 설정
  app.enableCors({
    origin: 'http://localhost:3000', // 프론트엔드 주소
    credentials: true,
  });

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 3001;

  // 글로벌 URL 프리픽스 설정
  app.setGlobalPrefix('api', { exclude: ['/health-check'] });

  // 글로벌 파이프라인 설정
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    })
  );

  // Swagger 설정
  const config = new DocumentBuilder()
    .setTitle('SPARTA FINAL PROJECT: FAN COMMUNITY')
    .setDescription('API description of Sparta Final Project - Fan Community')
    .setVersion('1.0')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' })
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true, // 새로고침 시에도 JWT 유지
      tagsSorter: 'alpha', // API 그룹 정렬 알파벳순
      operationsSorter: 'alpha', // API 그룹내에서도 정렬 알파벳순
    },
  });

  await app.listen(port);
}

bootstrap();
