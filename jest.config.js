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
  transformIgnorePatterns: ["/node_modules/(?!react-icons)"],
  collectCoverageFrom: ["src/**.ts", "src/**.tsx"]
}
