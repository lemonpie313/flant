import { PickType } from '@nestjs/swagger';
import { CommunityUser } from '../entities/communityUser.entity';

export class CommunityAssignDto extends PickType(CommunityUser, ['nickName']) {}
