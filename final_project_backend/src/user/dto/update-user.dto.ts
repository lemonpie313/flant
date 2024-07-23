import {
  IsOptional,
  IsString,
  IsStrongPassword,
  IsNotEmpty,
} from 'class-validator';

export class UpdateUserDto {
  /**
   * 비밀번호
   * @example "Example1!"
   */
  @IsNotEmpty({ message: '비밀번호를 입력해 주세요.' })
  @IsString()
  password: string;

  /**
   * 이름
   * @example 신짱구
   */
  @IsOptional()
  @IsString()
  name?: string;

  /**
   * 새 비밀번호
   * @example "Example2!"
   */
  @IsOptional()
  @IsStrongPassword(
    { minLength: 8 },
    {
      message: `새 비밀번호는 영문 알파벳 대,소문자, 숫자, 특수문자(!@#$%^&*)를 포함해서 8자리 이상으로 입력해야 합니다.`,
    },
  )
  newPassword?: string;

  /**
   * 새 비밀번호 확인
   * @example "Example2!"
   */
  @IsOptional()
  @IsStrongPassword(
    { minLength: 8 },
    {
      message: `새 비밀번호는 영문 알파벳 대,소문자, 숫자, 특수문자(!@#$%^&*)를 포함해서 8자리 이상으로 입력해야 합니다.`,
    },
  )
  newPasswordConfirm?: string;

  /**
   * 이미지 url
   * @example "https://i.namu.wiki/i/egdn5_REUgKuBUNPwkOg3inD6mLWMntHc-kXttvomkvaTMsWISF5sQqpHsfGJ8OUVqWRmV5xkUyRpD2U6g_oO03po08TisY6pAj5PXunSWaOHtGwrvXdHcL3p9_9-ZPryAadFZUE2rAxiK9vo5cv7w.svg"
   */
  @IsOptional()
  @IsString()
  profile_image?: string;
}
