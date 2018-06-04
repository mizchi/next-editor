const HtmlPlugin = require("html-webpack-plugin")
const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin")
const CopyPlugin = require("copy-webpack-plugin")
const mode = process.env.NODE_ENV || "development"
module.exports = {
  mode,
  entry: ["babel-polyfill", __dirname + "/src/index.tsx"],
  output: {
    path: __dirname + "/public",
    filename: "bundle.js"
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"]
  },
  stats: "errors-only",
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: [/node_modules/],
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.tsx?$/,
        use: {
          loader: "awesome-typescript-loader",
          options: {
            useBabel: true,
            babelCore: "babel-core"
          }
        }
      },
      {
        test: /\.css$/,
        use: [{ loader: "style-loader/url" }, { loader: "file-loader" }]
      }
    ]
  },
  plugins: [
    new HtmlPlugin({
      template: "src/index.html"
    }),
    new CopyPlugin([
      { from: __dirname + "/assets/*", to: __dirname + "/pubilc/assets/" }
    ]),
    new MonacoWebpackPlugin()
  ]
}
