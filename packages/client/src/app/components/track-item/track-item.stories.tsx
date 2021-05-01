import { Meta, Story } from '@storybook/react';
import TrackItem, { TrackItemProps } from './track-item';
import { ExampleTrack } from '../../../api/models/example-track';

export default {
  title: 'Components/TrackItem',
  component: TrackItem,
  parameters: {
    layout: 'fullscreen'
  }
} as Meta;

const Template: Story<TrackItemProps> = (args) => <TrackItem {...args} />;

export const Default = Template.bind({});
Default.args = {
  track: ExampleTrack
};
