import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';

@WebSocketGateway({ namespace: '/api/v1/chat', transports: ['websocket'] })
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly chatService: ChatService) {}
  handleConnection(@ConnectedSocket() client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(@ConnectedSocket() client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(
    @MessageBody() data: { roomId: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.join(data.roomId);
    client.emit('joinedRoom', data.roomId);
  }

  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(
    @MessageBody() data: { roomId: string, communityUserId },
    @ConnectedSocket() client: Socket,
  ) {
    this.chatService.addUserToRoom(+data.roomId, data.communityUserId)
    client.leave(data.roomId);
    client.emit('leftRoom', data.roomId);
  }

  @SubscribeMessage('sendMessage')
  handleMessage(
  @MessageBody() message: { roomId: string, text: string },
  @ConnectedSocket() client: Socket,
) {
  console.log(`Received message: ${message.text} from client: ${client.id}`);
  // 채팅방 내 다른 클라이언트에게 메시지를 브로드캐스트
  this.server.to(message.roomId).emit('receiveMessage', {
    clientId: client.id,
    text: message.text,
  });
}
}
