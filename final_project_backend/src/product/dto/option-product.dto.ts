import { PickType } from '@nestjs/swagger';
import { Option } from '../entities/option.entity';

export class OptionDto extends PickType(Option, ['optioName', 'price']) {}
