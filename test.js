const git = require("isomorphic-git")
const fs = require("fs")
const main = async () => {
  const ret = await git.listFiles({ fs, dir: __dirname })
  console.log(ret)
}

main()
