import { ApiPropertyOptional, PickType } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { Media } from '../entities/media.entity';

export class CreateMediaDto extends PickType(Media, ['title', 'content']) {
  /**
   * 미디어에 등록할 이미지 URL
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
