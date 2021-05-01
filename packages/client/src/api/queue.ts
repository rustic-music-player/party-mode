import { SocketApi } from './socket';
import { Provide } from '../commons/ioc-container';
import { TrackModel } from './models/track';

@Provide()
export class QueueApi {
  constructor(private socket: SocketApi) {
  }

  upvote(songUrl: string): void {
    this.socket.emit({
      type: 'client/command/upvote',
      song: songUrl,
    })
  }

  submit(songUrl: string): void {
    this.socket.emit({
      type: 'client/command/submit',
      song: songUrl,
    })
  }

  observeNowPlaying(callback: (playing: TrackModel) => void) {
    this.socket.subscribe('client/event/now-playing', msg => callback(msg.track as TrackModel));
  }

  observeQueue(callback: (queue: TrackModel[]) => void) {
    this.socket.subscribe('client/event/queue', msg => callback(msg.queue as TrackModel[]));
  }
}
