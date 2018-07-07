import fs from "fs"
import * as git from "isomorphic-git"
import path from "path"
import { createTempGitProject } from "../../__testHelpers__/helpers"

test("wip", async () => {
  const projectRoot = await createTempGitProject()
  await fs.promises.writeFile(path.join(projectRoot, "a.js"), "hhh")
  await git.add({ fs, dir: projectRoot, filepath: "a.js" })
  await git.commit({
    fs,
    dir: projectRoot,
    message: "test",
    author: { name: "xxx", email: "yyy" }
  })
  const log = await git.log({ fs, dir: projectRoot })
  console.log(log)
})
