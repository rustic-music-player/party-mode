import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ServerStore } from '../server-store';
import { NowPlayingUpdatedEvent } from '../events/now-playing-updated.event';

@EventsHandler(NowPlayingUpdatedEvent)
export class NowPlayingUpdatedSubscriber implements IEventHandler<NowPlayingUpdatedEvent> {
  constructor(private serverStore: ServerStore) {
  }

  async handle(event: NowPlayingUpdatedEvent) {
    const state = await this.serverStore.getState(event.serverId);
    state.current = event.track;
    await this.serverStore.update(event.serverId, state);
  }
}
