import { PickType } from '@nestjs/swagger';

import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';

import { Form } from '../entities/form.entity';
import { FromItemType } from '../types/form-item.enum';

export class CreateFormDto extends PickType(Form, ['title', 'content']) {
  /**
   * 설문 내용
   * @example "설문 내용 (예 :이름)"
   */
  @IsNotEmpty({ message: '이름을 입력해주세요' })
  @IsString()
  formItemContent: string;

  /**
   * 항목 타입
   * @example "idol"
   */
  @IsNotEmpty({ message: '항목을 선택해주세요' })
  @IsEnum(FromItemType, { message: '유효한 항목 타입을 선택해주세요' })
  formItemType: FromItemType;

  /**
   * 커뮤니티 ID
   * @example "1"
   */
  @IsNotEmpty({ message: '커뮤니티 ID를 입력해주세요' })
  @IsNumber()
  communityId: number;
}
