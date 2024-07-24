import { IsInt, IsNotEmpty, IsString } from 'class-validator';

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
  @IsNotEmpty({ message: `그룹 ID를 입력해 주세요.` })
  @IsInt()
  @Column()
  communityId: number;
  /**
   * 회원 ID
   * @example 1
   */
  @IsNotEmpty({ message: `유저 ID를 입력해 주세요.` })
  @IsInt()
  @Column()
  userId: number;

  /**
   * 매니저 닉네임
   * @example "츄 매니저 닉네임"
   */
  @IsNotEmpty({ message: `닉네임을 입력해 주세요.` })
  @IsString()
  @Column()
  managerNickname: string;

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
