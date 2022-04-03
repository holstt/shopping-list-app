module.exports = {
  preset: "jest-expo",
  roots: ["<rootDir>"],
  transform: {
    "^.+\\.[t|j]sx?$": "babel-jest",
    // "^.+\\.(ts|tsx)$": "ts-jest",
    // "^.+\\.tsx?$": "babel-jest",
  },
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.[jt]sx?$",
  moduleFileExtensions: ["ts", "js", "tsx", "json", "node"],
  collectCoverage: false,
  clearMocks: true,
  coverageDirectory: "coverage",
};
