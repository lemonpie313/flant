import {
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserRole } from '../types/user-role.type';
import { CommunityUser } from './../../community/entities/communityUser.entity';
import { MembershipPayment } from '../../membership/entities/membership-payment.entity';
import { Cart } from 'src/cart/entities/cart.entity';
import { Order } from 'src/order/entities/order.entity';
import { UserProvider } from '../types/user-provider.type';
import { Refreshtoken } from 'src/auth/entities/refresh-token.entity';
import { Exclude } from 'class-transformer';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn({ unsigned: true })
  userId: number;

  /**
   * 이름
   * @example"신짱구"
   */
  @IsNotEmpty({ message: `이름을 입력해 주세요.` })
  @IsString()
  @Column()
  name: string;
  /**
   * 이메일
   * @example "example@example.com"
   */
  @IsNotEmpty({ message: `이메일을 입력해 주세요.` })
  @IsEmail({}, { message: `이메일 형식에 맞지 않습니다.` })
  @Column({ unique: true })
  email: string;

  /**
   * 비밀번호
   * @example "Example1!"
   */
  @IsOptional()
  @IsStrongPassword(
    { minLength: 8 },
    {
      message: `비밀번호는 영문 알파벳 대,소문자, 숫자, 특수문자(!@#$%^&*)를 포함해서 8자리 이상으로 입력해야 합니다.`,
    },
  )
  @Column({ select: false, nullable: true })
  password?: string;

  /**
   * 이미지URL
   * @example "https://i.namu.wiki/i/egdn5_REUgKuBUNPwkOg3inD6mLWMntHc-kXttvomkvaTMsWISF5sQqpHsfGJ8OUVqWRmV5xkUyRpD2U6g_oO03po08TisY6pAj5PXunSWaOHtGwrvXdHcL3p9_9-ZPryAadFZUE2rAxiK9vo5cv7w.svg"
   */
  @IsNotEmpty({ message: '이미지 URL을 입력해 주세요.' })
  @IsString()
  @Column()
  profileImage?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @IsEnum(UserRole)
  @Column({ type: 'enum', enum: UserRole, default: UserRole.User }) //enum 타입으로 바꿀 예정
  role: UserRole;

  @IsInt()
  @Column({ default: 1000000 })
  point: number;

  @IsEnum(UserProvider)
  @Column({ type: 'enum', enum: UserProvider, default: UserProvider.Email }) //enum 타입으로 바꿀 예정
  provider: UserProvider;

  @OneToMany(() => CommunityUser, (communityUser) => communityUser.users)
  communityUsers: CommunityUser[];

  @OneToMany(
    () => MembershipPayment,
    (membershipPayment) => membershipPayment.user,
    { cascade: true },
  )
  membershipPayment: MembershipPayment;

  @OneToOne(() => Refreshtoken, (refreshtoken) => refreshtoken.user, {
    onDelete: 'CASCADE',
  })
  @Exclude()
  refreshtoken: Refreshtoken;
  //카트 연결
  @OneToOne(() => Cart, (cart) => cart.user)
  cart: Cart;

  //주문 연결
  @OneToMany(() => Order, (order) => order.user, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  order: Order[];
}
