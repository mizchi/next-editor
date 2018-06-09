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
  let pushResponse = await git.push({
    ...repo,
    remote: "origin",
    ref: "master",
    authUsername: process.env.GITHUB_TOKEN,
    authPassword: process.env.GITHUB_TOKEN
  })
  console.log(pushResponse)
  console.log("done")
}

main()
