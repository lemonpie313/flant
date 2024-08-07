import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Form } from './form.entity';
import { IsDate, IsEnum, IsNumber, IsOptional } from 'class-validator';
import { ApplyType } from '../types/form-apply-type.enum';

@Entity('form_item')
export class FormItem {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @Column()
  userId: number;

  @Column({ type: 'enum', enum: ApplyType })
  applyType: ApplyType;

  // form 연결
  @ManyToOne(() => Form, (form) => form.formItem)
  @JoinColumn({ name: 'form_id' })
  form: Form;
}
