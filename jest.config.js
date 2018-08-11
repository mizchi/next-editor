module.exports = {
  transform: {
    "^.+\\.tsx?$": "ts-jest",
    ".mdx?$": "@mizchi/jest-mdx-loader"
  },
  globals: {
    "ts-jest": {
      useBabelrc: false
    }
  },
  moduleNameMapper: {
    // "(.*).md": "<rootDir>/__tests__/mocks/dummyComponent.js",
    "(.*).css": "<rootDir>/__tests__/mocks/dummyObject.js"
  },
  testMatch: [
    "**/__tests__/**.test.ts",
    "**/__tests__/**.test.tsx",
    "**/__tests__/**.test.js"
  ],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  collectCoverageFrom: ["src/**.ts", "src/**.tsx"]
}
