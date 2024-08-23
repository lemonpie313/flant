// chat-message.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { ChatRoom } from './chat-room.entity';

@Entity()
export class ChatMessage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => ChatRoom, room => room.messages)
  room: ChatRoom;

  @Column()
  userId: string;

  @Column()
  message: string;

  @Column()
  timestamp: Date;
}
