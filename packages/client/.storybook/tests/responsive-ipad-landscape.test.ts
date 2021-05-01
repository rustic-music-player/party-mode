import initStoryshots from '@storybook/addon-storyshots';
import { imageSnapshot } from '@storybook/addon-storyshots-puppeteer';
import { responsiveTest } from './ui-tests';

initStoryshots({
  suite: 'Responsive - iPad Landscape',
  storyKindRegex: /^Pages/,
  test: imageSnapshot(responsiveTest('iPad landscape'))
})
