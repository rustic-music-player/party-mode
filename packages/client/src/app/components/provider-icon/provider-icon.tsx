import Icon from '@mdi/react';
import {
  mdiArchive,
  mdiFolderMultiple,
  mdiPlex,
  mdiPodcast,
  mdiSoundcloud,
  mdiSpotify,
  mdiYoutube,
} from '@mdi/js';
import { Provider } from '../../../api/models/track';

const icons = {
  [Provider.Internal]: mdiArchive,
  [Provider.Soundcloud]: mdiSoundcloud,
  [Provider.Spotify]: mdiSpotify,
  [Provider.Pocketcasts]: mdiPodcast,
  [Provider.Plex]: mdiPlex,
  [Provider.Local]: mdiFolderMultiple,
  [Provider.YouTube]: mdiYoutube,
};

export interface ProviderIconProps {
  provider: string;
  size?: any;
  className?: string;
}

const ProviderIcon = ({ provider, className, size }: ProviderIconProps) => {
  return <Icon path={icons[provider]} className={className} size={size}/>;
};

export default ProviderIcon;
