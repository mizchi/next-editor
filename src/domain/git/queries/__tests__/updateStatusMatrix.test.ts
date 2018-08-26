import * as helpers from "../../__testHelpers__"

import fs from "fs"
import * as git from "isomorphic-git"
import path from "path"
import assert from "power-assert"
import { updateStatusMatrix } from "../updateStatusMatrix"

test("update", async () => {
  // Create a
  const dir = await helpers.createTempGitProject()
  await helpers.batchUpdateFiles(dir, [["a", "1"]])
  const initial = await git.statusMatrix({ dir })
  assert.deepEqual(initial, [["a", 1, 1, 1]])

  // Update a
  await fs.promises.writeFile(path.join(dir, "a"), "1-mod")
  const updated = await updateStatusMatrix(dir, initial, ["a"])
  assert.deepEqual(updated, [["a", 1, 2, 1]])
})

test.only("update diff", async () => {
  // Create a, b
  const dir = await helpers.createTempGitProject()
  await helpers.batchUpdateFiles(dir, [["a", "1"], ["b", "2"]])
  const initial = await git.statusMatrix({ dir })
  assert.deepEqual(initial, [["a", 1, 1, 1], ["b", 1, 1, 1]])

  // Update a
  await fs.promises.writeFile(path.join(dir, "a"), "1-mod")
  const updatedWithB = await updateStatusMatrix(dir, initial, ["b"])
  assert.deepEqual(updatedWithB, [["a", 1, 1, 1], ["b", 1, 1, 1]])

  const updatedWithA = await updateStatusMatrix(dir, initial, ["a"])
  assert.deepEqual(updatedWithA, [["a", 1, 2, 1], ["b", 1, 1, 1]])

  // Add a
  await git.add({ dir, filepath: "a" })
  const added = await updateStatusMatrix(dir, updatedWithA, ["a"])
  assert.deepEqual(added, [["a", 1, 2, 2], ["b", 1, 1, 1]])

  // Reset a
  await git.resetIndex({ fs, dir, filepath: "a" })
  const reseted = await updateStatusMatrix(dir, initial, ["a"])
  assert.deepEqual(reseted, [["a", 1, 2, 1], ["b", 1, 1, 1]])
})

test("update with remove", async () => {
  // Create a, b
  const dir = await helpers.createTempGitProject()
  await helpers.batchUpdateFiles(dir, [["a", "1"], ["b", "2"]])
  const initial = await git.statusMatrix({ dir })
  assert.deepEqual(initial, [["a", 1, 1, 1], ["b", 1, 1, 1]])

  // Remove a
  await fs.promises.unlink(path.join(dir, "a"))
  const updated = await updateStatusMatrix(dir, initial, ["a"])
  assert.deepEqual(updated, [["a", 1, 0, 1], ["b", 1, 1, 1]])
})
