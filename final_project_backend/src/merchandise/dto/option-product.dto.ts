import { PickType } from '@nestjs/swagger';
import { MerchandiseOption } from '../entities/marchandise-option.entity';

export class MerchandiseOptionDto extends PickType(MerchandiseOption, [
  'optioName',
  'price',
]) {}
