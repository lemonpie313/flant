import { PickType } from "@nestjs/swagger";
import { Media } from "../entities/media.entity";
import { IsNumber, Max, Min } from "class-validator";

export class CreateMediaDto extends PickType(Media, ['title', 'content']) {
  @IsNumber()
  @Min(1900)
  @Max(2100)
  year: number

  @IsNumber()
  @Min(1)
  @Max(12)
  month: number

  @IsNumber()
  @Min(1)
  @Max(31)
  day: number

  @IsNumber()
  @Min(0)
  @Max(23)
  hour: number

  @IsNumber()
  @Min(0)
  @Max(59)
  minute: number
}
