import { SocketMessage } from './message';
import { TrackModel } from '../../tracks/track.model';

export class ClientNowPlayingChangedMessage implements SocketMessage {
  type = 'client/event/now-playing';

  constructor(public track: TrackModel) {
  }
}
