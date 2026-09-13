module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '\\.(css|less|scss)$': 'identity-obj-proxy',
  },
  transform: {
  '^.+\\.tsx?$': [
    'ts-jest',
    {
      tsconfig: {
        jsx: 'react-jsx',
        types: ['jest', '@testing-library/jest-dom'],
      },
      isolatedModules: true,
    },
  ],
},
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
};