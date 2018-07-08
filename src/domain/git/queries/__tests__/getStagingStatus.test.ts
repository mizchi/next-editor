import fs from "fs"
import * as git from "isomorphic-git"
import path from "path"
import assert from "power-assert"
import * as helpers from "../../__testHelpers__/helpers"
import { getStagingStatus } from "../getStagingStatus"

test("detect unmodified / modified", async () => {
  const root = await helpers.createTempGitProject()
  await helpers.batchUpdateFiles(root, [["a", "1"], ["b", "2"]])
  assert.deepEqual(await getStagingStatus(root), {
    a: "unmodified",
    b: "unmodified"
  })

  // Update a
  await fs.promises.writeFile(path.join(root, "a"), "3")
  await git.add({ fs, dir: root, filepath: "a" })
  assert.deepEqual(await getStagingStatus(root), {
    a: "modified",
    b: "unmodified"
  })

  // Back to unmodified
  await fs.promises.writeFile(path.join(root, "a"), "1")
  await git.add({ fs, dir: root, filepath: "a" })
  assert.deepEqual(await getStagingStatus(root), {
    a: "unmodified",
    b: "unmodified"
  })
})

test("detect staging", async () => {
  const root = await helpers.createTempGitProject()
  await helpers.batchUpdateFiles(root, [["a", "1"]])
  assert.deepEqual(await getStagingStatus(root), {
    a: "unmodified"
  })

  // Update a
  await fs.promises.writeFile(path.join(root, "a"), "1-modified")
  assert.deepEqual(await getStagingStatus(root), {
    a: "*modified"
  })
})

test("list added files", async () => {
  const root = await helpers.createTempGitProject()
  await helpers.batchUpdateFiles(root, [["a", "1"]])

  // Add b
  await fs.promises.writeFile(path.join(root, "b"), "2")
  assert.deepEqual(await getStagingStatus(root), {
    a: "unmodified",
    b: "*added"
  })
  await git.add({ fs, dir: root, filepath: "b" })

  assert.deepEqual(await getStagingStatus(root), {
    a: "unmodified",
    b: "added"
  })
})
