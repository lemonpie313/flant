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
  handleCreateRoom(client: Socket, roomId: string): void {
    this.chatService.createRoom(roomId);
    this.logger.log(`Room ${roomId} created by client ${client.id}`);
    client.emit('roomCreated', roomId); // 방 생성 완료 후 클라이언트에게 알림
  }

  // 클라이언트로부터 'msgToServer' 메시지를 수신했을 때 처리
  @SubscribeMessage('msgToServer')
  handleMessage(client: Socket, payload: { roomId: string, userId: string, message: string }): void {
    this.chatService.saveMessage(payload.roomId, payload.userId, payload.message);
    this.server.to(payload.roomId).emit('msgToClient', payload);
  }

  // 소켓 서버 초기화
  afterInit(server: Server) {
    this.logger.log('Init');
  }

  // 클라이언트 연결 해제
  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    // 사용자가 속한 모든 방에서 제거
    // 이 로직을 위해 사용자의 방 목록을 저장하는 별도의 구조가 필요할 수 있음
  }

  // 클라이언트 연결
  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  // 클라이언트를 특정 방에 추가
  @SubscribeMessage('joinRoom')
  handleJoinRoom(client: Socket, roomId: string) {
    client.join(roomId);
    this.logger.log(`Client ${client.id} joined room ${roomId}`);
  }

  // 클라이언트를 특정 방에서 제거
  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(client: Socket, roomId: string) {
    client.leave(roomId);
    this.logger.log(`Client ${client.id} left room ${roomId}`);
  }
}
