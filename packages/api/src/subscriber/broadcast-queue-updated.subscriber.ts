import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { QueueUpdatedEvent } from '../events/queue-updated.event';
import { ServerBroadcaster } from '../sockets/server-broadcaster';
import { ClientQueueUpdatedMessage } from '../sockets/messages/client-queue-updated.message';

@EventsHandler(QueueUpdatedEvent)
export class BroadcastQueueUpdatedSubscriber implements IEventHandler<QueueUpdatedEvent> {
  constructor(private serverBroadcaster: ServerBroadcaster) {
  }

  async handle(event: QueueUpdatedEvent): Promise<void> {
    await this.serverBroadcaster.broadcastToServer(event.serverId, new ClientQueueUpdatedMessage(event.tracks));
  }
}
