import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

import { FormType } from '../types/form-type.enum';

export class UpdateFormDto {
  /**
   * 제목
   *  @example "Form 수정 제목"
   */
  @IsOptional()
  @IsString()
  title: string;

  /**
   * 내용
   * @example "Form 수정 내용"
   */
  @IsOptional()
  @IsString()
  content: string;

  /**
   * 수정 항목 타입
   * @example "idol"
   */
  @IsOptional()
  @IsEnum(FormType, { message: '유효한 항목 타입을 선택해주세요' })
  formType: FormType;

  /**
   * 수정 선착순 인원
   * @example "100"
   */
  @IsOptional({ message: '선착순 인원을 입력해주세요' })
  @IsNumber()
  maxApply: number;

  /**
   * 수정 예비 인원
   * @example "20"
   */
  @IsOptional({ message: '예비 인원을 입력해주세요' })
  @IsNumber()
  spareApply: number;

  /**
   * 수정 신청 시작 시간
   * @example "2024-08-07 15:00"
   */
  @IsOptional({ message: '신청 시작 시간을 입력해주세요' })
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/, {
    message: '날짜 및 시간 형식이 올바르지 않습니다. 예: "2024-08-07 15:00"',
  })
  startTime: string;

  /**
   *  수정 신청 종료 시간
   * @example "2024-08-07 15:00"
   */
  @IsOptional({ message: '신청 종료 시간을 입력해주세요' })
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/, {
    message: '날짜 및 시간 형식이 올바르지 않습니다. 예: "2024-08-07 15:00"',
  })
  endTime: string;
}
