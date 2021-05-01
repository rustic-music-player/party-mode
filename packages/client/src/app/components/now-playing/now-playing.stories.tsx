import NowPlaying, { NowPlayingProps } from './now-playing';
import { Meta, Story } from '@storybook/react';
import { ExampleTrack } from '../../../api/models/example-track';

export default {
  title: 'Components/Now Playing',
  component: NowPlaying,
  parameters: {
    layout: 'fullscreen'
  }
} as Meta;

const Template: Story<NowPlayingProps> = (args) => <NowPlaying {...args} />;

export const Default = Template.bind({});
Default.args = {
  track: ExampleTrack
};
