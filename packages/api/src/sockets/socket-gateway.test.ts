import { SocketGateway } from './socket-gateway';
import { CommandBus, EventBus } from '@nestjs/cqrs';
import { IMock, Mock } from 'proxy-mocks/sinon';

describe('SocketGateway', () => {
  let commandBus: IMock<CommandBus>;
  let eventBus: IMock<EventBus>;

  let gateway: SocketGateway;

  beforeEach(() => {
    commandBus = Mock.of(CommandBus);
    eventBus = Mock.of(EventBus);

    gateway = new SocketGateway(commandBus, eventBus);
  });

  test('')
});
