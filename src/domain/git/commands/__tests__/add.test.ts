import fs from "fs"
import * as git from "isomorphic-git"
import path from "path"
import assert from "power-assert"
import * as helpers from "../../__testHelpers__/helpers"

test.skip("Add japanese filepath correctly", async () => {
  const root = await helpers.createTempGitProject()
  const addingFilepath = "日本語"
  await fs.promises.writeFile(path.join(root, addingFilepath), "1")
  await git.add({ fs, dir: root, filepath: addingFilepath })
  await git.commit({
    fs,
    dir: root,
    message: "Add japanese file",
    author: { email: "a", name: "a" }
  })
  const files = await git.listFiles({ fs, dir: root })
  console.log(files)
  assert.deepEqual(files, ["日本語"])
})
