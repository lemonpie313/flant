import { PickType } from '@nestjs/swagger';
import { Community } from '../entities/community.entity';
import { IsOptional, IsString } from 'class-validator';

export class UpdateCommunityDto extends PickType(Community, [
  'membershipPrice',
]) {
  /**
   * 커뮤니티(그룹) 이름
   * @example "Celestial Born"
   */
  @IsOptional()
  @IsString()
  communityName: string;
}
