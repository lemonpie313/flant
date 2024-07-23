import { PickType } from '@nestjs/swagger';
import { MerchandiseImage } from '../entities/merchandise-image.entity';

export class MerchandiseImageDto extends PickType(MerchandiseImage, [
  'imageUrl',
]) {}
