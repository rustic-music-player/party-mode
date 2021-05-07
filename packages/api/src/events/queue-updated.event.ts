import { TrackModel } from '../tracks/track.model';

export class QueueUpdatedEvent {
  constructor(public serverId: string, public tracks: TrackModel[]) {
  }
}
