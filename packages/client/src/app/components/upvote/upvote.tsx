import './upvote.scss';
import Icon from '@mdi/react';
import { mdiThumbUp } from '@mdi/js';
import React from 'react';
import { classnames } from '../../classnames';

export interface UpvoteProps {
  votes: number;
  voted: boolean;
  onUpvote?: () => void;
  className?: string;
}

const Upvote = ({ votes, voted, onUpvote, className }: UpvoteProps) => <button
  className={classnames('upvote-btn', className)} title="Upvote"
  onClick={onUpvote}>
  <Icon className={classnames("upvote-btn__icon", voted && "upvote-btn__icon--voted")} path={mdiThumbUp} size="24px"/>
  <span className="upvote-btn__counter">{votes}</span>
</button>

export default Upvote
