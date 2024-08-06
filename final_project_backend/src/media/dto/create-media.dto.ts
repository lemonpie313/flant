import { PickType } from "@nestjs/swagger";
import { Media } from "../entities/media.entity";
import { IsNumber, Max, Min } from "class-validator";

export class CreateMediaDto extends PickType(Media, ['title', 'content']) {

  /**
   * 공개 년도
   * @example 2024
   */
  @IsNumber()
  @Min(1900)
  @Max(2100)
  year: number

  /**
   * 공개 월
   * @example 8
   */
  @IsNumber()
  @Min(1)
  @Max(12)
  month: number

  /**
   * 공개 일
   * @example 15
   */
  @IsNumber()
  @Min(1)
  @Max(31)
  day: number

  /**
   * 공개 시간(시)
   * @example 20
   */
  @IsNumber()
  @Min(0)
  @Max(23)
  hour: number

  /**
   * 공개 시간(분)
   * @example 0
   */
  @IsNumber()
  @Min(0)
  @Max(59)
  minute: number
}
