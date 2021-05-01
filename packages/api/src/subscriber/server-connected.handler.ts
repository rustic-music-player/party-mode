import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ServerConnectedEvent } from '../events/server-connected.event';
import { ServerStore } from '../server-store';

@EventsHandler(ServerConnectedEvent)
export class ServerConnectedHandler implements IEventHandler<ServerConnectedEvent> {
  constructor(private serverStore: ServerStore) {
  }

  handle(event: ServerConnectedEvent): any {
    this.serverStore.put(event.serverId);
  }
}
