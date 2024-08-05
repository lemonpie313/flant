import { PickType } from "@nestjs/swagger";
import { Media } from "../entities/media.entity";

export class CreateMediaDto extends PickType(Media, ['title', 'content']) {}
