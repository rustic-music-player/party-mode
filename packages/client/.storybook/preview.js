import '../src/styles/styles.scss';

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};

export const globalTypes = {
  theme: {
    name: 'Theme',
    defaultValue: 'light',
    toolbar: {
      icon: 'photo',
      items: [
        { value: 'light', title: 'Light' },
        { value: 'dark', title: 'Dark' },
      ]
    }
  }
}

const withGlobalTheme = (Story, context) => {
  document.body.classList.remove('light', 'dark');
  document.body.classList.add(context.globals.theme);

  return <Story/>
}

export const decorators = [withGlobalTheme];
