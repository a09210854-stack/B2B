module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: ['/node_modules/'],
  setupFiles: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^vitest$': '<rootDir>/vitest-shim.js',
    '^vitest/(.*)$': '<rootDir>/vitest-shim.js',
    '^@prisma/client$': '<rootDir>/prisma-shim.js'
  }
};
