import { Meta, Story } from '@storybook/react';
import Search, { SearchProps } from './search';

export default {
  title: 'Components/Search',
  component: Search,
} as Meta;

const Template: Story<SearchProps> = (args) => <Search {...args} />;

export const Default = Template.bind({});
Default.args = {
}
