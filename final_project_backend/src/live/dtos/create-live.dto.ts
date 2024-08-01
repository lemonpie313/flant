import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { LiveTypes } from '../types/live-types.enum';

export class CreateLiveDto {
  @IsString()
  @IsNotEmpty()
 title: string;

  @IsEnum(LiveTypes)
  @IsNotEmpty()
  type: LiveTypes;
}
