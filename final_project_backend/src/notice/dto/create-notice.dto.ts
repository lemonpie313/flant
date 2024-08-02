import { ApiPropertyOptional, PickType } from '@nestjs/swagger';
import { Notice } from '../entities/notice.entity';
import { IsOptional, IsString } from 'class-validator';

export class CreateNoticeDto extends PickType(Notice, ['title', 'content']) {
  /**
   * 공지 사항에 등록할 이미지 URL
   * @example 'https://www.kasi.re.kr/file/content/20190408102300583_PFFSRTDT.jpg'
   */
  @ApiPropertyOptional({
    example:
      'https://www.kasi.re.kr/file/content/20190408102300583_PFFSRTDT.jpg',
  })
  @IsOptional()
  @IsString()
  noticeImageUrl: string | null;
}
