import { TrackModel } from '../../tracks/track.model';
import { SocketMessage } from './message';

export class ClientQueueUpdatedMessage implements SocketMessage {
  type = 'client/event/queue';

  constructor(public tracks: TrackModel[]) {
  }
}
