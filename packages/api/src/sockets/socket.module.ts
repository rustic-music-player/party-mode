import { Module } from '@nestjs/common';
import { SocketGateway } from './socket-gateway';
import { CqrsModule } from '@nestjs/cqrs';
import { SocketSender } from './socket-sender';

@Module({
  imports: [CqrsModule],
  providers: [
    SocketGateway,
    {
      provide: SocketSender,
      useExisting: SocketGateway,
    }
  ]
})
export class SocketModule {

}
