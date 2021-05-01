import { TrackModel } from 'src/api/models/track';
import React from 'react';
import './now-playing.scss';
import { classnames } from '../../classnames';

export interface NowPlayingProps {
  track: TrackModel;
  className?: string;
}

const NowPlaying = ({ track, className }: NowPlayingProps) => {
  if (track == null) {
    return <></>;
  }
  return <div className={classnames('now-playing', className)}>
    <img className="now-playing__cover-art" src={track.coverUrl} alt={track.title} />
    <h3 className="now-playing__title">{track.title}</h3>
    <h4 className="now-playing__artist">{track.artist}</h4>
    <h4 className="now-playing__album">{track.album}</h4>
  </div>;
};

export default NowPlaying;
