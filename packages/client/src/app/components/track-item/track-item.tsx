import './track-item.scss';
import { TrackModel } from '../../../api/models/track';
import React from 'react';
import Upvote from '../upvote/upvote';
import { classnames } from '../../classnames';
import ProviderIcon from '../provider-icon/provider-icon';

export interface TrackItemProps {
  track: TrackModel;
  onUpvote?: () => void;
  className?: string;
}

const TrackItem = ({ track, onUpvote, className }: TrackItemProps) => <div className={classnames("track-item", className)}>
  <img src={track.thumbnailUrl} className="track-item__cover" alt={track.title}/>
  <span className="track-item__title">{track.title}</span>
  <span className="track-item__artist">{track.artist}</span>
  <Upvote className="track-item__like" votes={track.votes} voted={false} onUpvote={onUpvote}/>
  <ProviderIcon className="track-item__icon" provider={track.provider}/>
</div>;

export default TrackItem;
