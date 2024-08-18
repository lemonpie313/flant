import { Form } from 'src/form/entities/form.entity';
import { MerchandisePost } from 'src/merchandise/entities/merchandise-post.entity';
import { IsInt, IsNotEmpty, IsString, Validate } from 'class-validator';
import { MESSAGES } from 'src/constants/message.constant';
import { IsNotEmptyConstraint } from 'src/util/decorators/is-not-emtpy-constraint.decorator';

import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { GoodsShop } from 'src/goods_shop/entities/goods-shop.entity';
import { CommunityUser } from 'src/community/community-user/entities/communityUser.entity';
import { Community } from './../../community/entities/community.entity';
import { Notice } from './../../notice/entities/notice.entity';

@Entity('managers')
export class Manager {
  @PrimaryGeneratedColumn()
  managerId: number;
  /**
   * 그룹 ID
   * @example 1
   */
  @IsNotEmpty({ message: MESSAGES.COMMUNITY.COMMON.COMMUNITYID.REQUIRED })
  @IsInt()
  @Column()
  communityId: number;
  /**
   * 회원 ID
   * @example 1
   */
  @IsNotEmpty({ message: MESSAGES.USER.COMMON.USERID.REQUIRED })
  @IsInt()
  @Column()
  communityUserId: number;

  /**
   * 매니저 닉네임
   * @example "츄 매니저 닉네임"
   */
  @IsNotEmpty({ message: MESSAGES.MANAGER.COMMON.NICKNAME.REQUIRED })
  @Validate(IsNotEmptyConstraint)
  @IsString()
  @Column()
  managerNickname: string;

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @OneToMany(() => Form, (form) => form.manager)
  form: Form[];

  @OneToMany(() => GoodsShop, (goodsShop) => goodsShop.manager)
  goodsShop: GoodsShop[];

  @OneToOne(() => CommunityUser, (communityUser) => communityUser.manager)
  communityUser: CommunityUser;

  @ManyToOne(() => Community, (community) => community.manager)
  community: Community;

  @OneToMany(() => Notice, (notice) => notice.manager)
  notice: Notice[];
}
