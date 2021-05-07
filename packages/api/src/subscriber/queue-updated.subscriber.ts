import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { QueueUpdatedEvent } from '../events/queue-updated.event';
import { ServerStore } from '../server-store';

@EventsHandler(QueueUpdatedEvent)
export class QueueUpdatedSubscriber implements IEventHandler<QueueUpdatedEvent> {
  constructor(private serverStore: ServerStore) {
  }

  async handle(event: QueueUpdatedEvent) {
    const state = await this.serverStore.getState(event.serverId);
    state.queue = event.tracks;
    await this.serverStore.update(event.serverId, state);

  }
}
