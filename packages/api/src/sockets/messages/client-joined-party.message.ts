import { SocketMessage } from './message';
import { TrackModel } from '../../tracks/track.model';

export class ClientJoinedPartyMessage implements SocketMessage {
  type = 'client/event/joined-party';

  constructor(
    public playing: TrackModel,
    public queue: TrackModel[] = [],
    public code: string,
  ) {
  }
}
