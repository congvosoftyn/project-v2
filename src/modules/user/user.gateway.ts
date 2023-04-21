import { Logger } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ namespace: 'booking' })
export class UserGateway implements OnGatewayDisconnect, OnGatewayConnection {
  private readonly logger = new Logger(UserGateway.name);

  @WebSocketServer()
  wss: Server;

  handleConnection(client: Socket, ...args: any[]): any {
    this.logger.verbose(`Client activity Connected: ${client.id}`);
  }

  handleDisconnect(client: Socket): any {
    this.logger.verbose(`Client activity Disconnected: ${client.id}`);
    this.logger.verbose(`Client Disconnected: ${client.id}`);
  }

  sendNotiEmail(id: number, parameter: string, data: any) {
    this.wss.sockets.in(id.toString()).emit(`${parameter}`, data);
  }
}
