import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ServerStore } from '../server-store';
import { ServerDisconnectedEvent } from '../events/server-disconnected.event';

@EventsHandler(ServerDisconnectedEvent)
export class ServerDisconnectedHandler implements IEventHandler<ServerDisconnectedEvent> {
  constructor(private serverStore: ServerStore) {
  }

  handle(event: ServerDisconnectedEvent): any {
    this.serverStore.remove(event.serverId);
  }
}
