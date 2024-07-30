import { Injectable } from '@nestjs/common';

// 채팅 메시지 인터페이스 정의
interface ChatMessage {
  roomId: string;
  userId: string;
  message: string;
  timestamp: Date;
}

// 채팅 방 인터페이스 정의
interface ChatRoom {
  roomId: string;
  users: string[];
  messages: ChatMessage[];
}

@Injectable()
export class ChatService {
  // 채팅 방을 저장할 객체
  private chatRooms: { [roomId: string]: ChatRoom } = {};

  // 새로운 채팅 방 생성
  createRoom(roomId: string) {
    if (!this.chatRooms[roomId]) {
      this.chatRooms[roomId] = {
        roomId,
        users: [],
        messages: [],
      };
    }
  }

  // 채팅 방에 사용자 추가
  addUserToRoom(roomId: string, userId: string) {
    const room = this.chatRooms[roomId];
    if (room && !room.users.includes(userId)) {
      room.users.push(userId);
    }
  }

  // 채팅 방에서 사용자 제거
  removeUserFromRoom(roomId: string, userId: string) {
    const room = this.chatRooms[roomId];
    if (room) {
      room.users = room.users.filter(user => user !== userId);
      if (room.users.length === 0) {
        delete this.chatRooms[roomId];
      }
    }
  }

  // 메시지 저장
  saveMessage(roomId: string, userId: string, message: string) {
    const room = this.chatRooms[roomId];
    if (room) {
      const chatMessage: ChatMessage = {
        roomId,
        userId,
        message,
        timestamp: new Date(),
      };
      room.messages.push(chatMessage);
    }
  }

  // 특정 방의 모든 메시지 가져오기
  getMessages(roomId: string): ChatMessage[] {
    return this.chatRooms[roomId]?.messages || [];
  }

  // 특정 방의 모든 사용자 가져오기
  getUsers(roomId: string): string[] {
    return this.chatRooms[roomId]?.users || [];
  }
}
