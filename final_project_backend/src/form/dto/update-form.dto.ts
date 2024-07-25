import { IsEnum, IsOptional, IsString } from 'class-validator';

import { FromItemType } from '../types/form-item.enum';

export class UpdateFormDto {
  /**
   * 제목
   *  @example "Form 제목"
   */
  @IsOptional()
  @IsString()
  title: string;

  /**
   * 내용
   * @example "Form 내용"
   */
  @IsOptional()
  @IsString()
  content: string;

  /**
   * 수정 설문 내용
   * @example "이름"
   */
  @IsOptional()
  @IsString()
  formItemContent: string;

  /**
   * 수정 항목 타입
   * @example "idol"
   */
  @IsOptional()
  @IsEnum(FromItemType, { message: '유효한 항목 타입을 선택해주세요' })
  formItemType: FromItemType;
}
