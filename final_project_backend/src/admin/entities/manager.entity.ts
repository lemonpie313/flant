import { IsInt, IsNotEmpty, IsString, Validate } from 'class-validator';
import { MESSAGES } from 'src/constants/message.constant';
import { IsNotEmptyConstraint } from 'src/util/decorators/is-not-emtpy-constraint.decorator';

import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

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
  userId: number;

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
}
