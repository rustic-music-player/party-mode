import initStoryshots from '@storybook/addon-storyshots';
import { imageSnapshot } from '@storybook/addon-storyshots-puppeteer';
import { responsiveTest } from './ui-tests';

initStoryshots({
  suite: 'Responsive - iPhone 8',
  storyKindRegex: /^Pages/,
  test: imageSnapshot(responsiveTest('iPhone 8'))
})
