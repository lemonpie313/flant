import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
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
  @ManyToOne(() => Form, (form) => form.formItem)
  @JoinColumn({ name: 'form_id' })
  form: Form;
}
