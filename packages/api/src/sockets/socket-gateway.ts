import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer
} from '@nestjs/websockets';
import * as WebSocket from 'ws';
import { CommandBus, EventBus } from '@nestjs/cqrs';
import { ClientConnectedEvent } from '../events/client-connected.event';
import { ServerConnectedEvent } from '../events/server-connected.event';
import { ServerDisconnectedEvent } from '../events/server-disconnected.event';
import { SocketSender } from './socket-sender';
import { ClientDisconnectedEvent } from 'src/events/client-disconnected.event';
import { parse } from 'url';
import { ParsedUrlQuery } from 'querystring';
import { Logger } from '@nestjs/common';
import { JoinPartyCommand } from '../commands/join-party.command';

@WebSocketGateway()
export class SocketGateway implements OnGatewayConnection<WebSocket>, OnGatewayDisconnect<WebSocket>, SocketSender {
  private clients = new WeakMap<WebSocket, string>();
  private servers = new WeakMap<WebSocket, string>();
  private logger = new Logger(SocketGateway.name);

  @WebSocketServer()
  server: WebSocket.Server;

  constructor(private commandBus: CommandBus, private eventBus: EventBus) {
  }

  @SubscribeMessage('client/command/upvote')
  async onUpvoteTrack(@ConnectedSocket() client: WebSocket, @MessageBody() msg: UpvoteCommandMessage) {

  }

  @SubscribeMessage('client/command/join')
  async onJoinServer(@ConnectedSocket() socket: WebSocket, @MessageBody() msg: JoinServerMessage) {
    await this.commandBus.execute(new JoinPartyCommand(this.clients.get(socket), msg.code));
  }

  handleConnection(socket: WebSocket, msg): any {
    const url = parse(msg.url, true);
    console.log(url.pathname, url.query)
    this.logger.debug(`Socket connected to ${msg.url}`);
    if (url.pathname === '/api/client') {
      const clientId = this.getClientId(url.query);
      this.handleClientConnected(socket, clientId);
    } else if (url.pathname === '/api/server') {
      const serverId = this.getServerId(url.query);
      this.handleServerConnected(socket, serverId);
    } else {
      socket.close();
    }
  }

  private handleClientConnected(socket: WebSocket, clientId: string) {
    this.logger.debug(`Client '${clientId}' connected`);
    this.clients.set(socket, clientId);
    this.eventBus.publish(new ClientConnectedEvent(clientId));
    socket.addEventListener('close', () => {
      this.logger.debug(`Client '${clientId}' disconnected`);
      this.eventBus.publish(new ClientDisconnectedEvent(clientId));
    });
  }

  private handleServerConnected(socket: WebSocket, serverId: string) {
    this.logger.debug(`Server '${serverId}' connected`);
    this.servers.set(socket, serverId);
    this.eventBus.publish(new ServerConnectedEvent(serverId));
    socket.addEventListener('close', () => {
      this.logger.debug(`Server '${serverId}' disconnected`);
      this.eventBus.publish(new ServerDisconnectedEvent(serverId));
    });
  }

  handleDisconnect(socket: WebSocket): any {
    this.clients.delete(socket);
    this.servers.delete(socket);
  }

  sendToClient(clientId: string, msg: any) {
    for (const socket of this.server.clients) {
      if (this.clients.get(socket) == clientId) {
        this.sendToSocket(socket, msg);
        return;
      }
    }
  }

  sendToServer(serverId: string, msg: any) {
    for (const socket of this.server.clients) {
      if (this.servers.get(socket) == serverId) {
        this.sendToSocket(socket, msg);
        return;
      }
    }
  }

  private sendToSocket(socket: WebSocket, msg: any) {
    socket.send(JSON.stringify(msg));
  }

  private getClientId(params: ParsedUrlQuery): string {
    return params.clientId as string;
  }

  private getServerId(params: ParsedUrlQuery): string {
    return params.serverId as string;
  }
}

interface UpvoteCommandMessage {
  type: 'client/command/upvote';
  song: string;
}

interface JoinServerMessage {
  type: 'client/command/join';
  code: string;
}
