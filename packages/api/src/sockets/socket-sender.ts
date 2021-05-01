export abstract class SocketSender {
  abstract sendToClient(clientId: string, msg: any);
  abstract sendToServer(serverId: string, msg: any);
}
