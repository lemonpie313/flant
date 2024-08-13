import { PickType } from "@nestjs/swagger";
import { Notice } from "../entities/notice.entity";

export class CreateNoticeDto extends PickType(Notice, ['title', 'content']) {
    /**
     * 작성할 커뮤니티 ID
     * @example 1
     */
    communityId: number;
}
