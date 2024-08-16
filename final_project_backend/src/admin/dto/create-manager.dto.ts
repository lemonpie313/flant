import { PickType } from '@nestjs/swagger';
import { Manager } from '../entities/manager.entity';

export class CreateManagerDto extends PickType(Manager, [
  'communityId',
  'communityUserId',
  'managerNickname',
]) {}
