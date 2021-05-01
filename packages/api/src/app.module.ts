import { Logger, Module } from '@nestjs/common';
import { AppService } from './app.service';
import { CqrsModule, EventBus } from '@nestjs/cqrs';
import { ClientConnectedHandler } from './subscriber/client-connected.handler';
import { ServerConnectedHandler } from './subscriber/server-connected.handler';
import { ServerStore } from './server-store';
import { ServerDisconnectedHandler } from './subscriber/server-disconnected.handler';
import { SocketGateway } from './sockets/socket-gateway';
import { SocketSender } from './sockets/socket-sender';

@Module({
  imports: [CqrsModule],
  providers: [
    AppService,
    ClientConnectedHandler,
    ServerConnectedHandler,
    ServerDisconnectedHandler,
    ServerStore,
    SocketGateway,
    {
      provide: SocketSender,
      useExisting: SocketGateway,
    },
  ],
})
export class AppModule {
  private logger = new Logger(AppModule.name);
  constructor(private eventBus: EventBus) {
    this.eventBus.subscribe((event) => {
      console.log(event);
      // this.logger.verbose(event);
    });
  }
}
