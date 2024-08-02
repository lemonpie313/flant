import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { LiveTypes } from '../types/live-types.enum';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

@Entity('live')
export class Live {
  @PrimaryGeneratedColumn({ unsigned: true })
  liveId: number;

  @Column({ type: 'int', unsigned: true })
  communityId: number;

  @Column({ type: 'int', unsigned: true })
  artistId: number;

  /**
   *  라이브 제목
   * @example "라이브 방송 테스트"
   */
  @IsString()
  @IsNotEmpty()
  @Column({ type: 'varchar', length: 255 })
  title: string;

  /**
   *  라이브 타입 (가로 or 세로)
   * @example Vertical
   */
  @IsEnum(LiveTypes)
  @IsNotEmpty()
  @Column({ type: 'enum', enum: LiveTypes })
  liveType: LiveTypes;

  @Column({ type: 'varchar', length: 255, unique: true })
  streamKey: string;

  @Column({ type: 'varchar', length: 255, unique: true, nullable: true })
  liveVideoUrl: string;

  @CreateDateColumn()
  createdAt: Date;
}
