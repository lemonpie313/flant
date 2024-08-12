import { PickType } from '@nestjs/swagger';
import { Artist } from '../entities/artist.entity';

export class CreateArtistDto extends PickType(Artist, [
  'communityId',
  'communityUserId',
  'artistNickname',
]) {}
