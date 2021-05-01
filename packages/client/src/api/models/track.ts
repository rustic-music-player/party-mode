export interface TrackModel {
  url: string;
  title: string;
  artist?: string;
  album?: string;
  coverUrl: string;
  thumbnailUrl: string;
  votes: number;
  provider: string;
}

export enum Provider {
  Internal = 'internal',
  Soundcloud = 'soundcloud',
  Spotify = 'spotify',
  Pocketcasts = 'pocketcasts',
  Plex = 'plex',
  Local = 'local',
  YouTube = 'youtube'
}
