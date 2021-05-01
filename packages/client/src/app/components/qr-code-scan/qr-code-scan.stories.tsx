import { Meta, Story } from '@storybook/react';
import QrCodeScan, { QrCodeScanProps } from './qr-code-scan';

export default {
  title: 'Components/QR Code Scan',
  component: QrCodeScan,
  parameters: {
    layout: 'centered'
  }
} as Meta;

const Template: Story<QrCodeScanProps> = (args) => <QrCodeScan {...args} />;

export const Default = Template.bind({});
Default.args = {
};
