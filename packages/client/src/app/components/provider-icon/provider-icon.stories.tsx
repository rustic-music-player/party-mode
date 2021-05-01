import { Meta, Story } from '@storybook/react';
import ProviderIcon, { ProviderIconProps } from "./provider-icon";
import { Provider } from '../../../api/models/track';

export default {
  title: 'Components/ProviderIcon',
  component: ProviderIcon,
  parameters: {
    layout: 'centered'
  },
} as Meta;

const Template: Story<ProviderIconProps> = (args) => <ProviderIcon {...args} />;

export const Default = Template.bind({});
Default.args = {
  provider: Provider.Internal,
  size: '24px'
}
