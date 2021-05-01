import { Meta, Story } from '@storybook/react';
import Queue, { QueueProps } from './queue';
import { ExampleTrack } from '../../../api/models/example-track';

export default {
  title: 'Components/Queue',
  component: Queue,
  parameters: {
    layout: 'fullscreen'
  }
} as Meta;

const Template: Story<QueueProps> = (args) => <Queue {...args} />;

export const Default = Template.bind({});
Default.args = {
  tracks: new Array(5).fill(ExampleTrack)
};
