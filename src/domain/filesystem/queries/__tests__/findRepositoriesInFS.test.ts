import fs from "fs"
import assert from "power-assert"
import rimraf from "rimraf"
import uuid from "uuid"
import { findRepositoriesWithGit } from "../findRepositoriesInFS"

test("findRepositories", async () => {
  const tmpRoot = `/tmp/${uuid().slice(0, 7)}`
  await fs.promises.mkdir(tmpRoot)
  await fs.promises.mkdir(tmpRoot + "/a")
  await fs.promises.mkdir(tmpRoot + "/a/.git")

  await fs.promises.mkdir(tmpRoot + "/b")
  await fs.promises.mkdir(tmpRoot + "/b/.git")

  await fs.promises.mkdir(tmpRoot + "/c")
  await fs.promises.mkdir(tmpRoot + "/c/d")
  await fs.promises.mkdir(tmpRoot + "/c/d/.git")
  await fs.promises.mkdir(tmpRoot + "/c/e")

  const ret = await findRepositoriesWithGit(tmpRoot)

  assert.deepEqual(ret.map(a => a.replace(tmpRoot, "")), ["/a", "/b", "/c/d"])
  rimraf.sync(tmpRoot)
})
