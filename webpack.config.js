const HtmlPlugin = require("html-webpack-plugin")
const mode = process.env.NODE_ENV || "development"
module.exports = {
  mode,
  entry: [__dirname + "/src/index.tsx"],
  output: {
    path: __dirname + "/public",
    filename: "bundle.js"
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"]
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: [/node_modules/],
        use: {
          loader: "babel-loader",
          options: {
            forceEnv: "development:client"
          }
        }
      },
      {
        test: /\.tsx?$/,
        use: {
          loader: "awesome-typescript-loader",
          options: {
            useBabel: true,
            babelCore: "@babel/core"
          }
        }
      }
    ]
  },
  plugins: [
    new HtmlPlugin({
      template: "src/index.html"
    })
  ]
}
