module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
    "^\\$server/(.*)$": "<rootDir>/src/server/$1",
    "^\\$lib/(.*)$": "<rootDir>/src/lib/$1",
  },
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
};
