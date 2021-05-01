import { TrackModel } from '../../../api/models/track';
import TrackItem from '../track-item/track-item';
import React from 'react';
import { classnames } from '../../classnames';

export interface QueueProps {
  tracks: TrackModel[];
  onUpvote?: (track: TrackModel) => void;
  className?: string;
}

const Queue = ({ className, tracks, onUpvote }: QueueProps) => <div className={classnames("queue", className)}>
  {tracks.map(track => <TrackItem track={track} onUpvote={() => onUpvote(track)}/>)}
</div>


export default Queue;
