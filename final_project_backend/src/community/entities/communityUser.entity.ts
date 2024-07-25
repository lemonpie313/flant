import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';
import { User } from '../../user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';

@Entity('community_users')
export class CommunityUser {
  @PrimaryGeneratedColumn({ unsigned: true })
  communityUserId: number;

  @Column({ unsigned: true })
  userId: number;

  @Column({ unsigned: true })
  communityId: number;

  @Column({ unsigned: true })
  groupMembershipId: number | null;

  /**
   * 커뮤니티에서 사용할 닉네임
   * @example 별하늘인간 팬
   */
  @IsString()
  @IsNotEmpty()
  @Column()
  nickName: string;

  @IsBoolean()
  @Column({ default: false })
  membership: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne((type) => User, (user) => user.communityUser)
  user: User;
}
