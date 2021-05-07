import { Logger, Module } from '@nestjs/common';
import { CqrsModule, EventBus } from '@nestjs/cqrs';
import { ClientJoinedServerSubscriber } from './subscriber/client-joined-server.subscriber';
import { ServerConnectedHandler } from './subscriber/server-connected.handler';
import { ServerStore } from './server-store';
import { ServerDisconnectedHandler } from './subscriber/server-disconnected.handler';
import { SocketGateway } from './sockets/socket-gateway';
import { SocketSender } from './sockets/socket-sender';
import { QueueUpdatedSubscriber } from './subscriber/queue-updated.subscriber';
import { ClientStore } from './client-store';
import { BroadcastQueueUpdatedSubscriber } from './subscriber/broadcast-queue-updated.subscriber';
import { ServerBroadcaster } from './sockets/server-broadcaster';
import { JoinPartyHandler } from './handlers/join-party.handler';
import { BroadcastNowPlayingUpdatedSubscriber } from './subscriber/broadcast-now-playing-updated.subscriber';
import { NowPlayingUpdatedSubscriber } from './subscriber/now-playing-updated.subscriber';
import { ImageController } from './controllers/image.controller';
import { S3Api } from './s3-api';
import { Config } from './config';

@Module({
  imports: [CqrsModule],
  controllers: [ImageController],
  providers: [
    BroadcastQueueUpdatedSubscriber,
    BroadcastNowPlayingUpdatedSubscriber,
    ClientJoinedServerSubscriber,
    ServerConnectedHandler,
    ServerDisconnectedHandler,
    QueueUpdatedSubscriber,
    NowPlayingUpdatedSubscriber,
    JoinPartyHandler,
    ServerStore,
    ClientStore,
    SocketGateway,
    Config,
    S3Api,
    {
      provide: SocketSender,
      useExisting: SocketGateway,
    },
    ServerBroadcaster,
  ],
})
export class AppModule {
  private logger = new Logger(AppModule.name);

  constructor(private eventBus: EventBus) {
    this.eventBus.subscribe((event) => {
      // console.log(event);
      // this.logger.verbose(event);
    });
  }
}
