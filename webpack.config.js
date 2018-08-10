const path = require("path")
const CopyPlugin = require("copy-webpack-plugin")
const WorkboxPlugin = require("workbox-webpack-plugin")
const UglifyJsPlugin = require("uglifyjs-webpack-plugin")
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin")

// Constants

const MODE = process.env.NODE_ENV || "development"
const DEV = MODE == "development"

const SRC = process.env.SRC_CUSTOM || "src"
const ENTRY_MAIN = path.join(__dirname, SRC || "src")

const SRC_INCLUDES = [
  path.join(__dirname, "src"),
  ...(SRC !== "src" ? [path.join(__dirname, SRC)] : [])
]

const COPY_RULES = [
  {
    from: path.join(__dirname, "src/index.html"),
    to: path.join(__dirname, "dist/index.html")
  },
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

if (SRC) {
  console.info("You are using custom entry:", ENTRY_MAIN)
}

module.exports = {
  mode: MODE,
  // devtool: DEV ? "inline-source-map" : "source-map",
  entry: ENTRY_MAIN,
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
    ? [new CopyPlugin(COPY_RULES)]
    : [
        new CopyPlugin(COPY_RULES),
        new WorkboxPlugin.GenerateSW({
          swDest: "sw.js",
          clientsClaim: true,
          skipWaiting: true
        })
      ]
}
