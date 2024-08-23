import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatRoom } from './entities/chat-room.entity';
import { ChatMessage } from './entities/chat-message.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ChatRoom)
    private chatRoomRepository: Repository<ChatRoom>,
    @InjectRepository(ChatMessage)
    private chatMessageRepository: Repository<ChatMessage>,
  ) {}

  async createRoom(roomId: string) {
    const room = this.chatRoomRepository.create({ roomId, users: [], messages: [] });
    await this.chatRoomRepository.save(room);
  }

  async addUserToRoom(roomId: string, userId: string) {
    const room = await this.chatRoomRepository.findOne({ where: { roomId } });
    if (room && !room.users.includes(userId)) {
      room.users.push(userId);
      await this.chatRoomRepository.save(room);
    }
  }

  async removeUserFromRoom(roomId: string, userId: string) {
    const room = await this.chatRoomRepository.findOne({ where: { roomId } });
    if (room) {
      room.users = room.users.filter(user => user !== userId);
      if (room.users.length === 0) {
        await this.chatRoomRepository.remove(room);
      } else {
        await this.chatRoomRepository.save(room);
      }
    }
  }

  async saveMessage(roomId: string, userId: string, message: string) {
    const room = await this.chatRoomRepository.findOne({ where: { roomId } });
    if (room) {
      const chatMessage = this.chatMessageRepository.create({
        room,
        userId,
        message,
        timestamp: new Date(),
      });
      await this.chatMessageRepository.save(chatMessage);
    }
  }

  async getMessages(roomId: string): Promise<ChatMessage[]> {
    const room = await this.chatRoomRepository.findOne({ where: { roomId }, relations: ['messages'] });
    return room?.messages || [];
  }

  async getUsers(roomId: string): Promise<string[]> {
    const room = await this.chatRoomRepository.findOne({ where: { roomId } });
    return room?.users || [];
  }
}
