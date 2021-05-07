import { SocketMessage } from './messages/message';
import { SocketSender } from './socket-sender';
import { ClientStore } from '../client-store';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ServerBroadcaster {
  constructor(private socketSender: SocketSender, private clientStore: ClientStore) {
  }

  async broadcastToServer(serverCode: string, msg: SocketMessage) {
    const clients = await this.clientStore.getClientsConnectedToServer(serverCode);
    for (const client of clients) {
      this.socketSender.sendToClient(client, msg);
    }
  }
}
