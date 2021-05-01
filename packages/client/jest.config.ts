export default {
  clearMocks: true,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  projects: [
    {
      displayName: 'unit',
      testMatch: [
        '<rootDir>/src/**/*.test.{ts,tsx}'
      ],
      setupFilesAfterEnv: ['jest-sinon'],
      moduleNameMapper: {
        '\\.scss$': '<rootDir>/.scripts/css-stub.js'
      }
    },
    {
      displayName: 'storybook',
      testMatch: [
        '<rootDir>/.storybook/tests/*.test.ts'
      ],
      moduleNameMapper: {
        '\\.scss$': '<rootDir>/.scripts/css-stub.js'
      }
    }
  ]
};
