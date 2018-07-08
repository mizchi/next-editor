import fs from "fs"
import * as git from "isomorphic-git"
import path from "path"
import assert from "power-assert"
import * as helpers from "../../__testHelpers__/helpers"
import { getFileStatus } from "../getFileStatus"

// test for git.status
test("getFileStatus", async () => {
  const root = await helpers.createTempGitProject()

  // TODO: WIP Error as initialState
  const s0 = await getFileStatus(root, "a")
  assert(s0 === "error")

  await git.commit({
    fs,
    dir: root,
    message: "init",
    author: { name: "e", email: "e" }
  })

  // absent after initialized
  const s1 = await getFileStatus(root, "a")
  assert(s1 === "absent")

  // unmodified after write
  await helpers.batchUpdateFiles(root, [["a", "1"]])
  const s2 = await getFileStatus(root, "a")
  assert(s2 === "unmodified")

  // remove a
  await fs.promises.unlink(path.join(root, "a"))
  const s3 = await git.status({ fs, dir: root, filepath: "a" })
  assert(s3 === "*deleted")

  // remove a from git
  await git.remove({ fs, dir: root, filepath: "a" })
  const s4 = await git.status({ fs, dir: root, filepath: "a" })
  assert(s4 === "deleted")

  // absent after commit
  await git.commit({
    fs,
    dir: root,
    message: "a",
    author: { name: "e", email: "e" }
  })
  const s5 = await getFileStatus(root, "a")
  assert(s5 === "absent")
})
