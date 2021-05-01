import { Provide } from '../commons/ioc-container';
import { SocketApi } from './socket';
import { TrackModel } from './models/track';

export interface PartyJoinEvent {
  playing: TrackModel;
  queue: TrackModel[];
  code: string;
}

@Provide()
export class PartyApi {
  constructor(private socket: SocketApi) {
  }

  joinParty(partyCode: string) {
    this.socket.emit({
      type: 'client/command/join',
      code: partyCode,
    });
  }

  observePartyDismissal(callback: () => void) {
    this.socket.subscribe('client/event/party-dismissed', () => callback());
  }

  observeJoinedParty(callback: (event: PartyJoinEvent) => void) {
    this.socket.subscribe('client/event/joined-party', msg => callback(msg as any as PartyJoinEvent));
  }
}
