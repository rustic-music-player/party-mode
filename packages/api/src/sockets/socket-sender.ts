import { SocketMessage } from './messages/message';

export abstract class SocketSender {
  abstract sendToClient(clientId: string, msg: SocketMessage);
  abstract sendToServer(serverId: string, msg: SocketMessage);
}
