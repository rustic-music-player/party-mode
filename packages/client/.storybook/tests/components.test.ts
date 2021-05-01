import initStoryshots from '@storybook/addon-storyshots';
import { imageSnapshot } from '@storybook/addon-storyshots-puppeteer';
import { screenshotConfig } from './ui-tests';

initStoryshots({
  suite: 'Component Snapshots',
  test: imageSnapshot(screenshotConfig),
})
