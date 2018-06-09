const git = require("isomorphic-git")
const path = require("path")
const fs = require("fs")

// const repo = {
//   dir: "/tmp/isomorphic-git",
//   fs
// }

// const main = async () => {
//   console.log("start")
//   await git.clone({
//     ...repo,
//     url:
//       "https://cors-buster-tbgktfqyku.now.sh/github.com/isomorphic-git/isomorphic-git",
//     singleBranch: true,
//     depth: 1
//   })
//   let pushResponse = await git.push({
//     ...repo,
//     remote: "origin",
//     ref: "master",
//     authUsername: process.env.GITHUB_TOKEN,
//     authPassword: process.env.GITHUB_TOKEN
//   })
//   console.log(pushResponse)
//   console.log("done")
// }

const repo = {
  dir: "/tmp/igit-" + Date.now(),
  fs
}
const main = async () => {
  fs.mkdirSync(repo.dir)
  await git.init(repo)
  fs.writeFileSync(repo.dir + "/a", "a")
  await git.add({ ...repo, filepath: "a" })
  await git.commit({
    ...repo,
    author: { name: "dummy", email: "dummy" },
    message: "Add a"
  })
  console.log("a stasus", await git.status({ ...repo, filepath: "a" }))

  fs.mkdirSync(repo.dir + "/src")
  fs.writeFileSync(repo.dir + "/src/b", "b")
  await git.add({ ...repo, filepath: "src/b" })

  console.log(
    "src/b stasus before",
    await git.status({ ...repo, filepath: "src/b" })
  )
  await git.commit({
    ...repo,
    author: { name: "dummy", email: "dummy" },
    message: "Add b"
  })
  console.log(
    "src/b stasus after",
    await git.status({ ...repo, filepath: "src/b" })
  )
}

main()
