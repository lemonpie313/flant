import { IsNotEmpty, IsNumber, IsString, IsUrl } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CommunityUser } from './communityUser.entity';

@Entity('communities')
export class Community {
  @PrimaryGeneratedColumn({ unsigned: true })
  communityId: number;

  /**
   * 커뮤니티(그룹) 이름
   * @example "Celestial Born"
   */
  @IsNotEmpty()
  @IsString()
  @Column()
  communityName: string;

  /**
   * 로고 이미지 Url
   * @example "https://www.kasi.re.kr/file/content/20190408102300583_PFFSRTDT.jpg"
   */
  @IsNotEmpty()
  @IsUrl()
  @Column()
  communityLogoImage: string;

  /**
   * 커버 이미지 Url
   * @example 'https://www.kasi.re.kr/file/205101983193671.jpg'
   */
  @IsNotEmpty()
  @IsUrl()
  @Column()
  communityCoverImage: string;

  /**
   * 유료 멤버쉽 가입 금액
   * @example 20000
   */
  @IsNotEmpty()
  @IsNumber()
  @Column({ unsigned: true })
  membershipPrice: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;

  @OneToMany(() => CommunityUser, (communityUser) => communityUser.communities)
  communityUsers: CommunityUser;
}
