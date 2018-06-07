const git = require("isomorphic-git")
const path = require("path")
const fs = require("fs")

const repo = {
  dir: "/tmp/isomorphic-git",
  fs
}

const main = async () => {
  console.log("start")
  await git.clone({
    ...repo,
    url:
      "https://cors-buster-tbgktfqyku.now.sh/github.com/isomorphic-git/isomorphic-git",
    singleBranch: true,
    depth: 1
  })
  console.log("done")
}

main()
