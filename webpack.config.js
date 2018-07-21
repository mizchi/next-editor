const webpack = require("webpack")
const path = require('path')
// const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin")
const CopyPlugin = require("copy-webpack-plugin")
const WorkboxPlugin = require("workbox-webpack-plugin")

const MODE = process.env.NODE_ENV || "development"
const DEV = MODE == "development"

module.exports = {
  mode: MODE,
  entry: {
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
        include: [
          path.join(__dirname, "src"),
        ],
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.js$/,
        include: [
          path.join(__dirname, "node_modules/react-icons")
        ],
        use: {
          loader: "babel-loader",
          options: {
            presets: ['@babel/preset-react']
          }
        }
      },
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
        test: /\.css$/,
        use: [{ loader: "style-loader/url" }, { loader: "file-loader" }]
      },
      {
        test: /\.md$/,
        use: ["babel-loader", "@mdx-js/loader"]
      }
    ]
  },
  plugins: [
    new CopyPlugin([
      {
        from: __dirname + "/src/index.html",
        to: __dirname + "/public/index.html"
      },
      {
        from: __dirname + "/src/manifest.json",
        to: __dirname + "/public/manifest.json"
      },
      {
        from: __dirname + "/assets/favicon.ico",
        to: __dirname + "/public/favicon.ico"
      },
      {
        from: __dirname + "/assets/**",
        to: __dirname + "/public"
      }
    ]),
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify(MODE),
      "process.env.DEBUG": JSON.stringify(process.env.DEBUG || DEV)
    }),
    // new MonacoWebpackPlugin(),
    new WorkboxPlugin.GenerateSW({
      swDest: "sw.js",
      clientsClaim: true,
      skipWaiting: true,
      exclude: DEV ? [/index\.html/, /main\.js/] : []
    })
  ]
}
