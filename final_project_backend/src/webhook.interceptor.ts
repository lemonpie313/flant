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
