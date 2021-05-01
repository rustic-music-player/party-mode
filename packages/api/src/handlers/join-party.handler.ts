import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { JoinPartyCommand } from '../commands/join-party.command';
import { ServerStore } from '../server-store';
import { SocketSender } from '../sockets/socket-sender';
import { Logger } from '@nestjs/common';

@CommandHandler(JoinPartyCommand)
export class JoinPartyHandler implements ICommandHandler<JoinPartyCommand> {
  private logger = new Logger(JoinPartyCommand.name);

  constructor(private serverStore: ServerStore, private socketSender: SocketSender) {
  }

  async execute(command: JoinPartyCommand): Promise<any> {
    const state = this.serverStore.getState(command.serverCode);
    if (state == null) {
      this.unknownServer(command);
    }
    
  }

  private unknownServer(command: JoinPartyCommand) {
    this.logger.debug(`Client '${command.clientId}' tried to join unknown server '${command.serverCode}'`);
    this.socketSender.sendToClient(command.clientId, {
      type: 'client/event/party-dismissed'
    });
  }
}
