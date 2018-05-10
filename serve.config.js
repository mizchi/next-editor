const path = require("path")
const convert = require("koa-connect")
const Router = require("koa-router")
const proxy = require("http-proxy-middleware")
const config = require("./webpack.config")

module.exports = {
  ...config,
  mode: "development",
  serve: {
    content: [__dirname],
    add: (app, middleware, options) => {
      app.use(
        convert(
          proxy("/.netlify", {
            target: "http://localhost:9000",
            pathRewrite: { "^/.netlify/functions": "" },
            changeOrigin: true
          })
        )
      )
    }
  }
}
