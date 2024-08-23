import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { ChatRoom } from './entities/chat-room.entity';
import { ChatMessage } from './entities/chat-message.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ChatRoom, ChatMessage])],
  providers: [ChatGateway, ChatService],
})
export class ChatModule {}
