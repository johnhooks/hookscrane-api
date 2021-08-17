module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleNameMapper: {
    // Intended to map esm modules with a `.js` ending to a commonjs module with no ending
    // "^(\\.{1,2}/.*)\\.js$": "$1",
    "^lib/(.*)$": "<rootDir>/lib/$1",
    "^plugins/(.*)$": "<rootDir>/plugins/$1",
    "^schema$": "<rootDir>/schema/index.ts",
    "^schema/(.*)$": "<rootDir>/schema/$1",
    "^server/(.*)$": "<rootDir>/server/$1",
  },
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
  // Run before the test framework is installed in the environment.
  setupFiles: ["<rootDir>/tests/setup.js"],
  // Run after the test framework has been installed in the environment.
  setupFilesAfterEnv: [],
};
