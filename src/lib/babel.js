const prettier = require("prettier/standalone")
const babel = require("@babel/standalone")
const babelConfig = {
  presets: ["react", "stage-3"],
  sourceMaps: false
}

const plugins = [require("prettier/parser-babylon")]

export function compileWithBabel(source) {
  const compiled = babel.transform(source, babelConfig)
  const formatted = prettier.format(compiled.code, {
    parser: "babylon",
    plugins
  })
  return formatted
}
