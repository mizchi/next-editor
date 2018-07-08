import fs from "fs"
import * as git from "isomorphic-git"
import path from "path"
import assert from "power-assert"
import * as helpers from "../../__testHelpers__/helpers"
import { getStagingStatus } from "../getStagingStatus"

test("detect unmodified / modified", async () => {
  const root = await helpers.createTempGitProject()
  await helpers.batchUpdateFiles(root, [["a", "1"], ["b", "2"]])
  const status0 = await getStagingStatus(root)
  assert.deepEqual(status0.unmodified, ["a", "b"])

  // Update a
  await fs.promises.writeFile(path.join(root, "a"), "3")
  await git.add({ fs, dir: root, filepath: "a" })
  const status1 = await getStagingStatus(root)
  assert.deepEqual(status1.unmodified, ["b"])
  assert.deepEqual(status1.staged, ["a"])

  // Back to unmodified
  await fs.promises.writeFile(path.join(root, "a"), "1")
  await git.add({ fs, dir: root, filepath: "a" })
  const status2 = await getStagingStatus(root)
  assert.deepEqual(status2.unmodified, ["a", "b"])
})

test("detect staging", async () => {
  const root = await helpers.createTempGitProject()
  await helpers.batchUpdateFiles(root, [["a", "1"]])
  const status0 = await getStagingStatus(root)
  assert.deepEqual(status0.unmodified, ["a"])

  // Update a
  await fs.promises.writeFile(path.join(root, "a"), "1-modified")
  const status1 = await getStagingStatus(root)
  assert.deepEqual(status1.modified, ["a"])
  assert.deepEqual(status1.unmodified, [])
})

test("list added files", async () => {
  const root = await helpers.createTempGitProject()
  await helpers.batchUpdateFiles(root, [["a", "1"]])

  await fs.promises.writeFile(path.join(root, "b"), "2")

  const status0 = await getStagingStatus(root)
  assert.deepEqual(status0.raw[1], {
    relpath: "b",
    status: "*added",
    staged: false
  })
})
