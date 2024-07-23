import { IsNotEmpty, IsString, IsUrl } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

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
   * @example https://www.kasi.re.kr/file/205101983193671.jpg
   */
  @IsNotEmpty()
  @IsUrl()
  @Column()
  communityCoverImage: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;
}
