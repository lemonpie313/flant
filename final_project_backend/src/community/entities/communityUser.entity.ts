import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Membership } from '../../membership/entities/membership.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  OneToOne,
} from 'typeorm';
import { Community } from './community.entity';
import { User } from '../../user/entities/user.entity';

@Entity('community_users')
export class CommunityUser {
  @PrimaryGeneratedColumn({ unsigned: true })
  communityUserId: number;

  @Column({ unsigned: true })
  userId: number;

  @Column({ unsigned: true })
  communityId: number;

  /**
   * 커뮤니티에서 사용할 닉네임
   * @example '별하늘인간 팬'
   */
  @IsString()
  @IsNotEmpty({ message: '커뮤니티에서 사용할 닉네임을 입력해주세요.' })
  @Column()
  nickName: string;

  @IsNumber()
  @Column({ default: false })
  membershipId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Community, (community) => community.communityUsers, {
    onDelete: 'CASCADE',
  })
  community: Community;

  @ManyToOne(() => User, (user) => user.communityUsers)
  users: User;

  @OneToOne(() => Membership, (membership) => membership.communityUser, {
    cascade: true,
  })
  membership?: Membership;
}
