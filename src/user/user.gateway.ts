import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UserService } from './user.service';

interface ClientToServerListen {
  online: (data: { isOnline: boolean; user_id: string }) => void;
}
interface ServerToClientListen {
  online: (data: { isOnline: boolean; user_id: string }) => void;
}

@WebSocketGateway({
  namespace: 'online',
  cors: {
    origin: '*',
  },
})
export class UserGateway {
  constructor(private readonly userService: UserService) {}
  @WebSocketServer() server: Server<ClientToServerListen, ServerToClientListen>;

  @SubscribeMessage('online')
  handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    data: {
      isOnline: boolean;
      user_id: string;
    },
  ): void {
    this.userService.changeOnline(data.user_id, data.isOnline);
  }
}
