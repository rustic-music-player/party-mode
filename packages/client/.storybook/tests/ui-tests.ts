import puppeteer from 'puppeteer';
import { ImageSnapshotConfig } from '@storybook/addon-storyshots-puppeteer';

export const screenshotConfig: Partial<ImageSnapshotConfig> = {
  // beforeScreenshot: page => page.addStyleTag({ content: '* { transition: none !important }'}),
  getGotoOptions: () => ({
    waitUntil: 'networkidle0',
  }),
}

export const responsiveTest = (device) => ({
  ...screenshotConfig,
  customizePage: page => page.emulate(puppeteer.devices[device]),
})

