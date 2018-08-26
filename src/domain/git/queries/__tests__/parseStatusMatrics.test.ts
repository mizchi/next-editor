import assert from "assert"
import fs from "fs"
import * as git from "isomorphic-git"
import path from "path"
import * as helpers from "../../__testHelpers__/helpers"
import {
  getDeletedFilenames,
  getModifiedFilenames,
  getUnstagedFilenames
} from "../parseStatusMatrix"

git.plugins.set("fs", fs)

test("detect changed paths", async () => {
  const dir = await helpers.createTempGitProject()
  await helpers.batchUpdateFiles(dir, [
    ["a", "commited"],
    ["b", "will be removed"]
  ])

  await fs.promises.unlink(path.join(dir, "b"))

  await fs.promises.writeFile(path.join(dir, "c"), "added")
  await git.add({ fs, dir, filepath: "c" })

  await fs.promises.writeFile(path.join(dir, "z"), "not staged")
  const mat = await (git as any).statusMatrix({ dir })

  const modified = getModifiedFilenames(mat)
  assert.deepEqual(modified, ["b", "c", "z"])

  const unstaged = getUnstagedFilenames(mat)
  assert.deepEqual(unstaged, ["b", "z"])

  const deleted = getDeletedFilenames(mat)
  assert.deepEqual(deleted, ["b"])
})
