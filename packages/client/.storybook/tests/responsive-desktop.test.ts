import initStoryshots from '@storybook/addon-storyshots';
import { imageSnapshot } from '@storybook/addon-storyshots-puppeteer';
import { screenshotConfig } from './ui-tests';

initStoryshots({
  suite: 'Responsive - Desktop',
  storyKindRegex: /^Pages/,
  test: imageSnapshot({
    ...screenshotConfig,
    customizePage: page => page.emulate({
      userAgent: '',
      viewport: {
        hasTouch: false,
        isLandscape: true,
        isMobile: false,
        width: 1920,
        height: 1080,
      }
    })
  })
})
