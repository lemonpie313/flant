import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { ChatRoom } from './chat-room.entity';

@Entity()
export class ChatMessage {
  @PrimaryGeneratedColumn('uuid')
  messageId: string;

  @Column()
  userId: string;

  @Column()
  message: string;

  @Column()
  timestamp: Date;

  @ManyToOne(() => ChatRoom, (room) => room.messages)
  room: ChatRoom;
}
