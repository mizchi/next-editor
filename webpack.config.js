// const HtmlPlugin = require("html-webpack-plugin")
const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin")
const CopyPlugin = require("copy-webpack-plugin")
const mode = process.env.NODE_ENV || "development"
module.exports = {
  mode,
  entry: {
    sw: ["babel-polyfill", __dirname + "/src/sw.js"],
    main: [__dirname + "/src/main.tsx"]
  },
  output: {
    path: __dirname + "/public",
    filename: "[name].js"
  },
  resolve: {
    alias: {
      fs: __dirname + "/src/lib/fs.js"
    },
    extensions: [".ts", ".tsx", ".js"]
  },
  stats: {
    colors: false
  },
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
    // new HtmlPlugin({
    //   template: "src/index.html"
    // }),
    new CopyPlugin([
      {
        from: __dirname + "/src/index.html",
        to: __dirname + "/public/index.html"
      },
      { from: __dirname + "/assets/*", to: __dirname + "/public" }
    ]),
    new MonacoWebpackPlugin()
  ]
}
