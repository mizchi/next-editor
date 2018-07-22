module.exports = {
  transform: {
    "^.+\\.tsx?$": "ts-jest"
  },
  globals: {
    "ts-jest": {
      useBabelrc: false
    }
  },
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.(js|tsx?)$",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  collectCoverageFrom: [
    "src/**.ts",
    "src/**.tsx"
  ]
}
