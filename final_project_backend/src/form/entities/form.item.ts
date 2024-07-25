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
import { FromItemType } from '../types/form-item.enum';
import { Form } from './form.entity';

@Entity('form_item')
export class FormItem {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @Column()
  content: string;

  @Column({ type: 'enum', enum: FromItemType, default: FromItemType.IDOL })
  type: FromItemType;

  // form 연결
  @ManyToOne(() => Form, (form) => form.formItem, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'manager_id' })
  form: Form;
}
