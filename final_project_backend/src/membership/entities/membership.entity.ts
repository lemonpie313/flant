import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CommunityUser } from '../../community/entities/communityUser.entity';

@Entity('membership_payment')
export class MembershipPayment {
  @PrimaryGeneratedColumn({ unsigned: true })
  membershipPaymentId: number;

  @Column({ unsigned: true })
  communityUserId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  expiration: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @OneToOne(() => CommunityUser, (communityUser) => communityUser.membershipPayment, { onDelete: 'CASCADE'})
  @JoinColumn({name: 'community_user_id'})
  communityUser: CommunityUser;
}
