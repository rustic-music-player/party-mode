import { Meta, Story } from '@storybook/react';
import Party, { InternalPartyProps } from './party';
import { ExampleTrack } from '../../../api/models/example-track';

export default {
  title: 'Pages/Party',
  component: Party,
  parameters: {
    layout: 'fullscreen'
  }
} as Meta;

const Template: Story<InternalPartyProps> = (args) => <Party {...args} />;

export const Default = Template.bind({});
Default.args = {
  playing: ExampleTrack,
  queue: new Array(10).fill(ExampleTrack),
};
