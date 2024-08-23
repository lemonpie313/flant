import { SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { ChatService } from './chat.service';

@WebSocketGateway()
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('ChatGateway');

  constructor(private readonly chatService: ChatService) {}

  @SubscribeMessage('createRoom')
  async handleCreateRoom(client: Socket, roomId: string): Promise<void> {
    await this.chatService.createRoom(roomId);
    this.logger.log(`Room ${roomId} created by client ${client.id}`);
    client.emit('roomCreated', roomId);
  }

  @SubscribeMessage('msgToServer')
  async handleMessage(client: Socket, payload: { roomId: string, userId: string, message: string }): Promise<void> {
    await this.chatService.saveMessage(payload.roomId, payload.userId, payload.message);
    this.server.to(payload.roomId).emit('msgToClient', payload);
  }

  afterInit(server: Server) {
    this.logger.log('Init');
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(client: Socket, roomId: string) {
    client.join(roomId);
    this.logger.log(`Client ${client.id} joined room ${roomId}`);
  }

  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(client: Socket, roomId: string) {
    client.leave(roomId);
    this.logger.log(`Client ${client.id} left room ${roomId}`);
  }
}
