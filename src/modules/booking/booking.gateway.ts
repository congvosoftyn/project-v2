import { Logger, UseGuards } from '@nestjs/common';
import { ConnectedSocket, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import * as jwt from 'jsonwebtoken';
import { LIFE_SECRET } from 'src/config';
import { WsGuard } from 'src/shared/guards/wsGuard.pipe';

@WebSocketGateway( { namespace: 'booking' })
export class BookingGateway implements OnGatewayDisconnect, OnGatewayConnection {
  private readonly logger = new Logger(BookingGateway.name);

  @WebSocketServer()
  wss: Server;

  private users = {}

  handleConnection(client: Socket, ...args: any[]): any {
    this.logger.verbose(`Client activity Connected: ${client.id}`);
  }

  handleDisconnect(client: Socket): any {
    this.logger.verbose(`Client activity Disconnected: ${client.id}`);
    this.logger.verbose(`Client Disconnected: ${client.id}`);
  }

  @UseGuards(WsGuard)
  @SubscribeMessage('booking.join')
  userJoin(@ConnectedSocket() client: Socket) {
    try {
      const token = client.handshake.headers.authorization?.split(' ')?.[1];
      const decoded = jwt.verify(token, `${LIFE_SECRET}`) as any;
      this.users[client.id] = decoded.storeId
    } catch (err) {
      console.log(err);
    }
  }

  sendNotiBooking(storeId: number, parameter: string, data: any) {
    const clientId = Object.keys(this.users).find(k => this.users[k] === storeId);
    this.wss.in(`${clientId}`).emit(`${parameter}`, data);
  }
}
