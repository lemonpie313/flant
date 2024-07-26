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
  JoinColumn,
  OneToMany,
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

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Community, (community) => community.communityUsers, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({name: 'community_id'})
  community: Community;

  @ManyToOne(() => User, (user) => user.communityUsers)
  @JoinColumn({name: 'user_id'})
  users: User;

  @OneToMany(() => Membership, (membership) => membership.communityUser, {
    cascade: true,
  })
  membership: Membership[];
}
