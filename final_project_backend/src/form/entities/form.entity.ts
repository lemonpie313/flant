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
import { IsNotEmpty, IsString } from 'class-validator';
import { Exclude } from 'class-transformer';

@Entity('form')
export class Form {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  /**
   * 제목
   *  @example "Form 제목"
   */
  @IsNotEmpty({ message: '제목을 입력해주세요' })
  @IsString()
  @Column()
  title: string;

  /**
   * 내용
   * @example "Form 내용"
   */
  @IsNotEmpty({ message: '내용을 입력해주세요' })
  @IsString()
  @Column()
  content: string;

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

  //   // 매니저 연결
  //   @ManyToOne(() => Manager, (manager) => manager.form, {
  //     onDelete: 'CASCADE',
  //   })
  //   @JoinColumn({ name: 'manager_id' })
  //   manager: Manager;

  //   //커뮤니티 연결
  //   @ManyToOne(() => Community, (community) => community.form, {
  //     onDelete: 'CASCADE',
  //   })
  //   @JoinColumn({ name: 'community_id' })
  //   community: Community;
}
