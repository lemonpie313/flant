import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
  } from 'typeorm';
import { Media } from './media.entity';
  
  @Entity('media_files')
  export class MediaFile {
    @PrimaryGeneratedColumn({ unsigned: true })
    postImageId: number;
  
    @Column({ unsigned: true })
    noticeId: number;

    @Column({ unsigned: true })
    managerId: number;
  
    @Column()
    mediaFileUrl: string;
  
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
  
    @ManyToOne(() => Media, (media) => media.mediaFiles, { onDelete: 'CASCADE' })
    media: Media;
  }