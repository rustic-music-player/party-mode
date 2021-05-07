import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ServerBroadcaster } from '../sockets/server-broadcaster';
import { NowPlayingUpdatedEvent } from '../events/now-playing-updated.event';
import { ClientNowPlayingChangedMessage } from '../sockets/messages/client-now-playing-changed.message';

@EventsHandler(NowPlayingUpdatedEvent)
export class BroadcastNowPlayingUpdatedSubscriber implements IEventHandler<NowPlayingUpdatedEvent> {
  constructor(private serverBroadcaster: ServerBroadcaster) {
  }

  async handle(event: NowPlayingUpdatedEvent): Promise<void> {
    await this.serverBroadcaster.broadcastToServer(event.serverId, new ClientNowPlayingChangedMessage(event.track));
  }
}
