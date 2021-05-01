import { QueueApi } from '../../api/queue';
import { TrackModel } from '../../api/models/track';
import { action, makeObservable, observable } from 'mobx';
import { Singleton } from '../../commons/ioc-container';
import { PartyApi } from '../../api/party';

@Singleton()
export class PlayerState {
  @observable
  upcoming: TrackModel[] = [];

  @observable
  current?: TrackModel;

  constructor(private queueApi: QueueApi, private partyApi: PartyApi) {
    makeObservable(this);
    this.queueApi.observeQueue(this.updateQueue);
    this.queueApi.observeNowPlaying(this.updateCurrent);
    this.partyApi.observeJoinedParty(event => {
      this.updateQueue(event.queue);
      this.updateCurrent(event.playing);
    });
  }

  @action.bound
  private updateQueue(tracks: TrackModel[]) {
    this.upcoming = tracks;
  }

  @action.bound
  private updateCurrent(track: TrackModel) {
    this.current = track;
  }

  voteTrack(track: TrackModel) {
    this.queueApi.upvote(track.url);
  }

  submitTrack(track: TrackModel) {
    this.queueApi.submit(track.url);
  }
}
