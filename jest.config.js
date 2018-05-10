module.exports = {
  transform: {
    "^.+\\.tsx?$": "ts-jest"
  },
  globals: {
    "ts-jest": {
      useBabelrc: true
    }
  },
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.(js|tsx?)$",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"]
}
