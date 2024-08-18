import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { FormItem } from './form.item';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { Exclude } from 'class-transformer';
import { Manager } from 'src/admin/entities/manager.entity';
import { Community } from 'src/community/entities/community.entity';
import { FormType } from '../types/form-type.enum';

@Entity('form')
export class Form {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @Column({unsigned: true})
  managerId: number;

  @Column()
  title: string;

  @Column()
  content: string;

  @IsEnum({
    type: 'enum',
    enum: FormType,
  })
  @Column()
  formType: FormType;

  @Column()
  maxApply: number;

  @Column()
  spareApply: number;

  @Column()
  startTime: string;

  @Column()
  endTime: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;

  //form-item 연결
  @OneToMany(() => FormItem, (formItem) => formItem.form, {
    onDelete: 'CASCADE',
  })
  formItem: FormItem[];

  // 매니저 연결
  @ManyToOne(() => Manager, (manager) => manager.form, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'manager_id' })
  manager: Manager;

  //커뮤니티 연결
  @ManyToOne(() => Community, (community) => community.form, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'community_id' })
  community: Community;
}
