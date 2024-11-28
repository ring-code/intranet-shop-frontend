module.exports = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest', // Use babel-jest to transform modern JS syntax
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(react-router-dom)/)', // Allow transforming react-router-dom
  ],
  testEnvironment: 'jest-environment-jsdom', // Ensure proper test environment
};
