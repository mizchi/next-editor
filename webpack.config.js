const path = require("path")
const CopyPlugin = require("copy-webpack-plugin")
const WorkboxPlugin = require("workbox-webpack-plugin")
const UglifyJsPlugin = require("uglifyjs-webpack-plugin")
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin")

const MODE = process.env.NODE_ENV || "development"
const DEV = MODE == "development"

const copyRules = [
  {
    from: __dirname + "/src/index.html",
    to: __dirname + "/dist/index.html"
  },
  {
    from: __dirname + "/src/manifest.json",
    to: __dirname + "/dist/manifest.json"
  },
  {
    from: __dirname + "/assets/favicon.ico",
    to: __dirname + "/dist/favicon.ico"
  },
  {
    from: __dirname + "/assets/landing.html",
    to: __dirname + "/dist/landing.html"
  },
  {
    from: __dirname + "/assets/**",
    to: __dirname + "/dist"
  },
  {
    from: __dirname + "/node_modules/@blueprintjs/icons/resources/icons",
    to: __dirname + "/dist/resources/icons"
  }
]

module.exports = {
  mode: MODE,
  devtool: DEV ? "inline-source-map" : "source-map",
  resolve: {
    alias: {
      fs: __dirname + "/src/lib/fs.ts"
    },
    extensions: [".ts", ".tsx", ".js"]
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: "ts-loader",
            options: {
              transpileOnly: true
            }
          }
        ]
      },
      {
        test: /\.js$/,
        include: [path.join(__dirname, "src")],
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.css$/,
        use: [{ loader: "style-loader/url" }, { loader: "file-loader" }]
      },
      {
        test: /\.md$/,
        use: ["babel-loader", "@mdx-js/loader"]
      }
    ]
  },
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: false // set to true if you want JS source maps
      }),
      new OptimizeCSSAssetsPlugin({})
    ]
  },
  plugins: DEV
    ? [new CopyPlugin(copyRules)]
    : [
        new CopyPlugin(copyRules),
        new WorkboxPlugin.GenerateSW({
          swDest: "sw.js",
          clientsClaim: true,
          skipWaiting: true
        })
      ]
}
