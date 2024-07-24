import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';
import { MembershipPayment } from 'src/membership/entities/membership.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('community_users')
export class CommunityUser {
  @PrimaryGeneratedColumn({ unsigned: true })
  communityUserId: number;

  @Column({ unsigned: true })
  userId: number;

  @Column({ unsigned: true })
  communityId: number;

  // @Column({ unsigned: true })
  // groupMembershipId: number | null;

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

  @OneToOne(() => MembershipPayment, (membershipPayment) => membershipPayment.communityUser, { cascade: true })
  membershipPayment?: MembershipPayment;
}
