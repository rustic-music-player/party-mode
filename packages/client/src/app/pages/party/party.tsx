import './party.scss';
import Search from '../../components/search/search';
import NowPlaying from '../../components/now-playing/now-playing';
import React from 'react';
import Queue from '../../components/queue/queue';
import { PlayerState } from '../../state/player.state';
import { observer } from 'mobx-react-lite';
import { TrackModel } from '../../../api/models/track';

export interface InternalPartyProps {
  playing?: TrackModel;
  queue: TrackModel[];
}

const Party = observer(({ playing, queue }: InternalPartyProps) => <div className="party">
  <Search className="party__search" />
  <NowPlaying track={playing} className="party__now-playing" />
  <Queue tracks={queue} className="party__queue" />
</div>);

export interface PartyProps {
  playerState: PlayerState;
}

export default observer(({ playerState }: PartyProps) => <Party playing={playerState.current}
                                                                queue={playerState.upcoming} />);
