import { Meta, Story } from '@storybook/react';
import Upvote, { UpvoteProps } from './upvote';

export default {
  title: 'Components/Upvote',
  component: Upvote,
  parameters: {
    layout: 'centered'
  }
} as Meta;

const Template: Story<UpvoteProps> = (args) => <Upvote {...args} />;

export const Default = Template.bind({});
Default.args = {
  votes: 0,
  voted: false,
}

export const Voted = Template.bind({});
Voted.args = {
  votes: 0,
  voted: true,
}
