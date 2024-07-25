import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Membership } from './membership.entity';

@Entity('membership_payment')
export class MembershipPayment {
  @PrimaryGeneratedColumn({ unsigned: true })
  membershipPaymentId: number;

  @Column({ unsigned: true })
  userId: number;

  @Column({ unsigned: true })
  membershipId: number;

  @Column({ unsigned: true })
  price: number;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.membershipPayment, { onDelete: 'CASCADE'})
  @JoinColumn({name: 'user_id'})
  user: User;

  @ManyToOne(() => Membership, (membership) => membership.membershipPayment)
  membership: Membership;
}
