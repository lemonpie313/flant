import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ChatMessage } from './chat-message.entity';

@Entity()
export class ChatRoom {
  @PrimaryGeneratedColumn('uuid')
  roomId: string;

  @Column('simple-array')
  users: string[];

  @OneToMany(() => ChatMessage, (message) => message.room)
  messages: ChatMessage[];
}
