import { Logger } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway( { namespace: 'app' })
export class AppGateway implements OnGatewayDisconnect, OnGatewayConnection {
  private readonly logger = new Logger(AppGateway.name);
  private previousId: string;

  @WebSocketServer()
  wss: Server;
  // private users = {}

  handleConnection(client: Socket, ...args: any[]): any {
    this.logger.verbose(`Client activity Connected: ${client.id}`);
  }

  handleDisconnect(client: Socket): any {
    this.logger.verbose(`Client activity Disconnected: ${client.id}`);
    this.logger.verbose(`Client Disconnected: ${client.id}`);
  }

  @SubscribeMessage('create')
  handleMessage(client: Socket, payload: { room: string }) {
    this.safeJoin(client, payload.room);
  }

  // @UseGuards(WsGuard)
  // @SubscribeMessage('booking.join')
  // userJoin(@ConnectedSocket() client: Socket) {
  //   try {
  //     const token = client.handshake.headers.authorization?.split(' ')?.[1];
  //     const decoded = jwt.verify(token, `${LIFE_SECRET}`) as any;
  //     this.users[client.id] = decoded.storeId
  //   } catch (err) {
  //     console.log(err);
  //   }
  // }

  safeJoin(client: Socket, currentId: string) {
    client.leave(this.previousId);
    client.join(`${currentId}`);
    this.previousId = `${currentId}`;
  }
}
