import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { JoinPartyCommand } from '../commands/join-party.command';
import { ServerStore } from '../server-store';
import { SocketSender } from '../sockets/socket-sender';
import { Logger } from '@nestjs/common';
import { ClientStore } from '../client-store';
import { ClientJoinedPartyMessage } from '../sockets/messages/client-joined-party.message';

@CommandHandler(JoinPartyCommand)
export class JoinPartyHandler implements ICommandHandler<JoinPartyCommand> {
  private logger = new Logger(JoinPartyCommand.name);

  constructor(private clientStore: ClientStore, private serverStore: ServerStore, private socketSender: SocketSender) {
  }

  async execute(command: JoinPartyCommand): Promise<any> {
    const state = await this.serverStore.getState(command.serverCode);
    if (state == null) {
      this.unknownServer(command);
      return;
    }
    await this.clientStore.joinServer(command.clientId, command.serverCode);
    this.socketSender.sendToClient(command.clientId, new ClientJoinedPartyMessage(state.current, state.queue, command.serverCode));
  }

  private unknownServer(command: JoinPartyCommand) {
    this.logger.debug(`Client '${command.clientId}' tried to join unknown server '${command.serverCode}'`);
    this.socketSender.sendToClient(command.clientId, {
      type: 'client/event/party-dismissed'
    });
  }
}
