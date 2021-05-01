import { Meta, Story } from '@storybook/react';
import LandingPage, { LandingPageProps } from './landing';

export default {
  title: 'Pages/Landing',
  component: LandingPage,
  parameters: {
    layout: 'fullscreen'
  }
} as Meta;

const Template: Story<LandingPageProps> = (args) => <LandingPage {...args} />;

export const Default = Template.bind({});
Default.args = {
};
