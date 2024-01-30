import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessengerService } from './messenger.service';
import { SendMessageDto } from './dto/send-message.dto';

@WebSocketGateway({
  namespace: 'messenger',
  cors: {
    origin: '*',
  },
})
export class MessengerGateway {
  constructor(private readonly messengerService: MessengerService) {}

  @WebSocketServer() server: Server;

  @SubscribeMessage('joinToRoom')
  joinToRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    room_id: string,
  ): void {
    client.join(room_id);
    console.log('to room connected');
  }

  @SubscribeMessage('messages')
  async sendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    sendMessageDto: SendMessageDto,
  ): Promise<void> {
    const newMessage = await this.messengerService.sendMessage(sendMessageDto);
    console.log(newMessage);
    this.server.to(sendMessageDto.socket_room_id).emit('messages', newMessage);
  }
}
