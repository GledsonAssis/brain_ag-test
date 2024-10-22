/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  collectCoverageFrom: [
    "<rootDir>/src/**/*.ts",
    "!<rootDir>/src/**/index.ts",
    "!<rootDir>/src/**/types.ts",
    "!<rootDir>/src/**/logger/**/*.ts",
    "!<rootDir>/src/**/models/**/*.ts",
    "!<rootDir>/src/**/server/**/*.ts",
    "!<rootDir>/src/**/interfaces/controllers/schema/**/*.ts",
    "!<rootDir>/src/**/main.ts",
    "!<rootDir>/src/infra/server/config/env.ts",
    "!<rootDir>/src/infra/server/config/module-alias.ts",
  ],
  coverageDirectory: "coverage",
  coverageProvider: "babel",
  testTimeout: 10000,
  testEnvironment: "node",
  moduleNameMapper: {
    "@/test/(.+)": "<rootDir>/test/$1",
    "@/(.+)": "<rootDir>/src/$1",
  },
  preset: "@shelf/jest-mongodb",
  testMatch: ["**/*.test.ts"],
  roots: ["<rootDir>/src", "<rootDir>/test"],
  transform: {
    "\\.ts$": "ts-jest",
  },
  clearMocks: true,
};
