module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/**/main.ts',
    '!src/**/composition/*.ts',
  ],
  coveragePathIgnorePatterns: ['/node_modules/', '/dist/'],
};
