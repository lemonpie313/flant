// chat.gateway.ts
import { SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { ChatService } from './chat.service';

@WebSocketGateway()
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('ChatGateway');

  constructor(private readonly chatService: ChatService) {}

  @SubscribeMessage('msgToServer')
  async handleMessage(client: Socket, payload: { roomId: string, userId: string, message: string }) {
    await this.chatService.saveMessage(payload.roomId, payload.userId, payload.message);
    this.server.to(payload.roomId).emit('msgToClient', payload);
  }

  afterInit(server: Server) {
    this.logger.log('Init');
  }

  async handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    const rooms = this.server.sockets.adapter.rooms;
    rooms.forEach(async (room, roomId) => {
      if (room.has(client.id)) {
        client.leave(roomId);
        await this.chatService.removeUserFromRoom(roomId, client.id);
        this.logger.log(`Client ${client.id} left room ${roomId}`);
      }
    });
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(client: Socket, data: { roomId: string, userId: string }) {
    client.join(data.roomId);
    await this.chatService.addUserToRoom(data.roomId, data.userId);
    this.logger.log(`Client ${client.id} joined room ${data.roomId}`);
  }

  @SubscribeMessage('leaveRoom')
  async handleLeaveRoom(client: Socket, data: { roomId: string, userId: string }) {
    client.leave(data.roomId);
    await this.chatService.removeUserFromRoom(data.roomId, data.userId);
    this.logger.log(`Client ${client.id} left room ${data.roomId}`);
  }
}
