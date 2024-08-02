import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { LiveTypes } from '../types/live-types.enum';
import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';
import { Live } from './live.entity';

@Entity('live-recordings')
export class LiveRecordings {
  @PrimaryGeneratedColumn({ unsigned: true })
  liveRecordingId: number;

  @Column({ type: 'int', unsigned: true, unique: true, })
  liveId: number;

  @IsUrl()
  @IsOptional()
  @Column({ type: 'varchar', length: 255 })
  thumbnail: string;

  @IsUrl()
  @IsNotEmpty()
  @Column({type: 'varchar', length: 255 })
  media: string;

  @OneToOne(() => Live, (live) => live.liveRecording)
  @JoinColumn({name: 'live_id'})
  live: Live;
}