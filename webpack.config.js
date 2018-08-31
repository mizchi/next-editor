const path = require("path")
const CopyPlugin = require("copy-webpack-plugin")
const WorkboxPlugin = require("workbox-webpack-plugin")
const UglifyJsPlugin = require("uglifyjs-webpack-plugin")
const HtmlPlugin = require("html-webpack-plugin")
const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin")
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin")

// Constants

const MODE = process.env.NODE_ENV || "development"
const DEV = MODE == "development"

const USE_CUSTOM_SRC = !!process.env.SRC
const SRC = path.join(__dirname, process.env.SRC || "src")

const SRC_INCLUDES = [
  path.join(__dirname, "src"),
  ...(process.env.SRC ? [SRC] : [])
]

const COPY_RULES = [
  {
    from: path.join(__dirname, "src/manifest.json"),
    to: path.join(__dirname, "/dist/manifest.json")
  },
  {
    from: path.join(__dirname, "/assets/favicon.ico"),
    to: path.join(__dirname, "/dist/favicon.ico")
  },
  {
    from: path.join(__dirname, "assets/landing.html"),
    to: path.join(__dirname, "dist/landing.html")
  },
  {
    from: path.join(__dirname, "assets/**"),
    to: path.join(__dirname, "dist")
  },
  {
    from: path.join(
      __dirname,
      "node_modules/@blueprintjs/icons/resources/icons"
    ),
    to: path.join(__dirname, "dist/resources/icons")
  }
]

if (USE_CUSTOM_SRC) {
  console.info("You are using custom entry:", SRC)
}

const plugins = [
  new MonacoWebpackPlugin(),
  new HtmlPlugin({
    inject: false,
    template: path.join(SRC, "index.html.ejs")
  }),
  new CopyPlugin(COPY_RULES)
]

module.exports = {
  mode: MODE,
  // devtool: DEV ? "inline-source-map" : "source-map",
  entry: { main: SRC },
  output: {
    filename: "[name].js",
    chunkFilename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist")
  },
  resolve: {
    alias: {
      fs: path.join(__dirname, "src/lib/fs.ts")
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
      // {
      //   test: /\.tsx?$/,
      //   use: [
      //     {
      //       loader: "babel-loader"
      //     }
      //   ]
      // },
      {
        test: /\.js$/,
        include: SRC_INCLUDES,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.css$/,
        use: [{ loader: "style-loader/url" }, { loader: "file-loader" }]
      },
      {
        test: /\.mdx?$/,
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
    ? plugins
    : [
        ...plugins,
        new WorkboxPlugin.GenerateSW({
          swDest: "sw.js",
          clientsClaim: true,
          skipWaiting: true,
          exclude: ["assets/icon-*.png"]
        })
      ]
}
