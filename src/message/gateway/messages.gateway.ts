import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { AuthService } from '../../auth/service/auth.service';
import { UnauthorizedException, UseGuards } from '@nestjs/common';
// import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@WebSocketGateway({ cors: { origin: 'https://hoppscotch.io' } })
export class MessagesGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private authService: AuthService) {}

  @WebSocketServer()
  server;

  // @UseGuards(JwtAuthGuard)
  @SubscribeMessage('message')
  handleMessage(socket: Socket, payload: any) {
    console.log(socket?.handshake?.auth?.token);
    this.server.emit('message', 'Hello World');
  }

  async handleConnection(socket: Socket, ...args: any[]) {
    this.authService
      .verifyJwt(socket.handshake?.auth?.token)
      .then((user: any) => {
        console.log(user);
        this.server.emit('message', 'connected');
      })
      .catch((e) => {
        console.log(e);
        return this.disconnect(socket);
      });
  }
  handleDisconnect(socket: Socket) {
    console.log('Client disconnected');
  }

  @SubscribeMessage('createRoom')
  async onCreateRoom(socket: Socket, payload: any) {
    return 'this.roomService.crateRoom(socket, payload)';
  }

  private disconnect(socket: Socket) {
    socket.emit('Error', new UnauthorizedException());
    socket.disconnect();
  }
}
