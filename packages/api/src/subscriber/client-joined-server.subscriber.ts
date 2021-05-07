import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { SocketSender } from '../sockets/socket-sender';
import { ClientJoinedServerEvent } from '../events/client-joined-server.event';
import { ClientStore } from '../client-store';
import { ServerStore } from '../server-store';
import { ClientQueueUpdatedMessage } from '../sockets/messages/client-queue-updated.message';

@EventsHandler(ClientJoinedServerEvent)
export class ClientJoinedServerSubscriber implements IEventHandler<ClientJoinedServerEvent> {
  constructor(private clientStore: ClientStore, private serverStore: ServerStore, private socketSender: SocketSender) {
  }

  async handle(event: ClientJoinedServerEvent): Promise<void> {
    await this.clientStore.joinServer(event.clientId, event.serverCode)
    const state = await this.serverStore.getState(event.serverCode);
    this.socketSender.sendToClient(event.clientId, new ClientQueueUpdatedMessage(state.queue))
  }
}
