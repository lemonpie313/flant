import { PickType } from "@nestjs/swagger";
import { Community } from "../entities/community.entity";

export class UpdateLogoImageDto extends PickType(Community, ['communityLogoImage']) {}