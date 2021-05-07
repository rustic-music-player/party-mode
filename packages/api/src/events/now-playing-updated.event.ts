import { TrackModel } from '../tracks/track.model';

export class NowPlayingUpdatedEvent {
  constructor(public serverId: string, public track: TrackModel) {
  }
}
