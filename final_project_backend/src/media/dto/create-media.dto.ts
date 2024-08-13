import { ApiPropertyOptional, PickType } from "@nestjs/swagger";
import { Media } from "../entities/media.entity";
import { IsNumber, IsOptional, IsString, Max, Min } from "class-validator";
import { Transform } from "class-transformer";

export class CreateMediaDto extends PickType(Media, ['title', 'content']) {

  /**
   * 유튜브 영상일 경우 URL
   * @example "https://www.youtube.com/watch?v=KXnkhWRCj40"
   */
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  youtubeUrl : string;

  @IsNumber()
  communityId: number;

  /**
   * 공개 년도
   * @example 2024
   */
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @Min(1900)
  @Max(2100)
  year: number

  /**
   * 공개 월
   * @example 8
   */
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @Min(1)
  @Max(12)
  month: number

  /**
   * 공개 일
   * @example 15
   */
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @Min(1)
  @Max(31)
  day: number

  /**
   * 공개 시간(시)
   * @example 20
   */
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @Min(0)
  @Max(23)
  hour: number

  /**
   * 공개 시간(분)
   * @example 0
   */
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @Min(0)
  @Max(59)
  minute: number
}
