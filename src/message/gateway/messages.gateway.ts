import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';

@WebSocketGateway({ cors: { origin: 'https://hoppscotch.io' } })
export class MessagesGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server;

  @SubscribeMessage('message')
  handleMessage(client: any, payload: any) {
    console.log(payload);
    this.server.emit('message', 'Hello World');
  }

  handleConnection(client: any, ...args: any[]) {
    console.log('Client connected');
    // Implement user authentication

    this.server.emit('message', 'connected');
  }
  handleDisconnect(client: any) {
    console.log('Client disconnect');
    this.server.emit('message', 'disconnect');
  }
}
