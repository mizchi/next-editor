const path = require("path")
const config = require("./webpack.config")

module.exports = {
  ...config,
  mode: "development"
}
