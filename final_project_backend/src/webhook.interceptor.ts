// 로컬 환경만 가능 혹시 모르니 코드를 남김
/*
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Sentry from '@sentry/node';
import { IncomingWebhook } from '@slack/client';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable()
export class SentryWebhookInterceptor implements NestInterceptor {
  constructor(private readonly configService: ConfigService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        // Sentry에 에러를 기록
        Sentry.captureException(error);

        // Slack으로 메시지를 보냄
        const slackWebhook = this.configService.get<string>('SLACK_WEBHOOk');
        const webhook = new IncomingWebhook(slackWebhook);
        webhook.send({
          attachments: [
            {
              color: 'danger',
              text: `🚨 API 서버 에러발생 🚨`,
              fields: [
                {
                  title: error.message,
                  value: error.stack,
                  short: false,
                },
              ],
              ts: Math.floor(new Date().getTime() / 1000).toString(),
            },
          ],
        });

        // 에러를 다시 throw하여 NestJS의 예외 처리 시스템이 처리하도록 함
        if (error instanceof HttpException) {
          return throwError(() => error);
        } else {
          return throwError(
            () =>
              new HttpException(
                error.message || 'Internal server error',
                HttpStatus.INTERNAL_SERVER_ERROR,
              ),
          );
        }
      }),
    );
  }
}

*/

import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Sentry from '@sentry/node';
import { IncomingWebhook } from '@slack/client';
import { catchError, Observable, throwError } from 'rxjs';
import axios from 'axios';

@Injectable()
export class SentryWebhookInterceptor implements NestInterceptor {
  constructor(private readonly configService: ConfigService) {}

  private async getEc2InstanceIp(): Promise<string> {
    try {
      const response = await axios.get(
        'http://169.254.169.254/latest/meta-data/public-ipv4',
        { timeout: 1000 },
      );
      return response.data;
    } catch (error) {
      return 'localhost'; // 로컬 환경일 경우 'localhost'로 설정
    }
  }

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const instanceIp = await this.getEc2InstanceIp();

    return next.handle().pipe(
      catchError((error) => {
        // Sentry에 에러를 기록하고 IP 주소 추가
        Sentry.withScope((scope) => {
          scope.setExtra('instance_ip', instanceIp);
          Sentry.captureException(error);
        });

        // Slack으로 메시지를 보냄
        // const slackWebhook = this.configService.get<string>('SLACK_WEBHOOK');
        const slackWebhook =
          'https://hooks.slack.com/services/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';
        const webhook = new IncomingWebhook(slackWebhook);
        webhook.send({
          attachments: [
            {
              color: 'danger',
              text: `🚨 API 서버 에러발생 🚨`,
              fields: [
                {
                  title: error.message,
                  value: error.stack,
                  short: false,
                },
                {
                  title: 'EC2 Instance IP',
                  value: instanceIp,
                  short: false,
                },
              ],
              ts: Math.floor(new Date().getTime() / 1000).toString(),
            },
          ],
        });

        // 에러를 다시 throw하여 NestJS의 예외 처리 시스템이 처리하도록 함
        if (error instanceof HttpException) {
          return throwError(() => error);
        } else {
          return throwError(
            () =>
              new HttpException(
                error.message || 'Internal server error',
                HttpStatus.INTERNAL_SERVER_ERROR,
              ),
          );
        }
      }),
    );
  }
}
