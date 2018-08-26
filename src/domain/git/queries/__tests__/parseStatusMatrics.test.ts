import assert from "assert"
import fs from "fs"
import * as git from "isomorphic-git"
import path from "path"
import "../../__testHelpers__"
import * as helpers from "../../__testHelpers__/helpers"
import {
  getModifiedFilenames,
  getRemovableFilenames,
  getRemovedFilenames,
  getStagedFilenames,
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
  await git.add({ dir, filepath: "c" })

  await fs.promises.writeFile(path.join(dir, "z"), "not staged")
  const mat = await (git as any).statusMatrix({ dir })

  const modified = getModifiedFilenames(mat)
  assert.deepEqual(modified, ["b", "c", "z"])

  const unstaged = getUnstagedFilenames(mat)
  assert.deepEqual(unstaged, ["b", "z"])
})

test("getDeletedFilenames", async () => {
  const dir = await helpers.createTempGitProject()
  await helpers.batchUpdateFiles(dir, [["a", "commited"]])

  await fs.promises.unlink(path.join(dir, "a"))

  const mat = await (git as any).statusMatrix({ dir })

  const removables = getRemovableFilenames(mat)
  assert.deepEqual(removables, ["a"])

  // Git remove
  await git.remove({ dir, filepath: "a" })
  const mat2 = await (git as any).statusMatrix({ dir })
  const removables2 = getRemovableFilenames(mat2)
  assert.deepEqual(removables2, [])

  const removed = getRemovedFilenames(mat2)
  assert.deepEqual(removed, ["a"])
})

test("ignore files on .gitignore", async () => {
  const dir = await helpers.createTempGitProject()
  await helpers.batchUpdateFiles(dir, [[".gitignore", "a"]])

  const mat = await (git as any).statusMatrix({ dir })
  await fs.promises.writeFile(path.join(dir, "a"), "ignore me")

  const modified = getModifiedFilenames(mat)
  assert.deepEqual(modified, [])
})

test("getStagedFiles", async () => {
  const dir = await helpers.createTempGitProject()
  await helpers.batchUpdateFiles(dir, [["a", "x"], ["b", "y"]])

  await fs.promises.writeFile(path.join(dir, "a"), "y")
  await git.add({ dir, filepath: "a" })

  const mat = await (git as any).statusMatrix({ dir })

  const added = getStagedFilenames(mat)

  assert.deepEqual(added, ["a"])
})

test("getStagedFiles with change", async () => {
  const dir = await helpers.createTempGitProject()
  await helpers.batchUpdateFiles(dir, [["a", "x"], ["b", "y"]])

  await fs.promises.writeFile(path.join(dir, "a"), "y")
  await git.add({ dir, filepath: "a" })

  await fs.promises.writeFile(path.join(dir, "a"), "z")

  const mat = await (git as any).statusMatrix({ dir })

  const added = getStagedFilenames(mat)

  assert.deepEqual(added, ["a"])
})
