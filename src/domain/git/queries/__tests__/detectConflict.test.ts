import "../../__testHelpers__"

import fs from "fs"
import * as git from "isomorphic-git"
import path from "path"
import pify from "pify"
import assert from "power-assert"
// tslint:disable-next-line
import * as helpers from "../../__testHelpers__/helpers"
import { detectConflict } from "../detectConflict"

test("no conflict", async () => {
  const dir = await helpers.createTempGitProject()
  await helpers.batchUpdateFiles(dir, [["x", "0"]])

  await git.branch({ dir, ref: "a" })
  await git.checkout({ dir, ref: "a" })
  await helpers.batchUpdateFiles(dir, [["x", "a"]])

  await git.branch({ dir, ref: "b" })
  await git.checkout({ dir, ref: "b" })
  await helpers.batchUpdateFiles(dir, [["x", "b"]])

  await git.checkout({ dir, ref: "a" })
  await git.branch({ dir, ref: "c" })
  await git.checkout({ dir, ref: "c" })
  await helpers.batchUpdateFiles(dir, [["x", "b"]])

  const ret = await detectConflict(dir, "a", "b", "c")
  assert(ret.conflicts.length === 0)
})

test("with conflict", async () => {
  const dir = await helpers.createTempGitProject()
  await helpers.batchUpdateFiles(dir, [["x", "0"]])

  await git.branch({ dir, ref: "a" })
  await git.checkout({ dir, ref: "a" })
  await helpers.batchUpdateFiles(dir, [["x", "a"]])

  await git.branch({ dir, ref: "b" })
  await git.checkout({ dir, ref: "b" })
  await helpers.batchUpdateFiles(dir, [["x", "b"]])

  await git.checkout({ dir, ref: "a" })
  await git.branch({ dir, ref: "c" })
  await git.checkout({ dir, ref: "c" })
  await helpers.batchUpdateFiles(dir, [["x", "c"]])

  const ret = await detectConflict(dir, "a", "b", "c")
  assert(ret.conflicts.length === 1)
})

test("no conflict with added files", async () => {
  const dir = await helpers.createTempGitProject()
  await helpers.batchUpdateFiles(dir, [["x", "0"]])

  await git.branch({ dir, ref: "a" })
  await git.checkout({ dir, ref: "a" })
  await helpers.batchUpdateFiles(dir, [["x", "a"]])

  await git.branch({ dir, ref: "b" })
  await git.checkout({ dir, ref: "b" })
  await helpers.batchUpdateFiles(dir, [["y", "1"]])

  await git.checkout({ dir, ref: "a" })
  await git.branch({ dir, ref: "c" })
  await git.checkout({ dir, ref: "c" })
  await helpers.batchUpdateFiles(dir, [["y", "1"], ["z", "2"]])

  const ret = await detectConflict(dir, "a", "b", "c")
  assert(ret.conflicts.length === 0)
})

test("no conflict with removed file", async () => {
  const dir = await helpers.createTempGitProject()
  await helpers.batchUpdateFiles(dir, [["x", "0"]])

  await git.branch({ dir, ref: "a" })
  await git.checkout({ dir, ref: "a" })
  await helpers.batchUpdateFiles(dir, [["x", "a"]])

  await git.branch({ dir, ref: "b" })
  await git.checkout({ dir, ref: "b" })
  await pify(fs.unlink)(path.join(dir, "x"))
  await git.remove({ dir, filepath: "x" })
  await git.commit({
    dir,
    message: "Update",
    author: { name: "n", email: "e" }
  })

  await git.checkout({ dir, ref: "a" })
  await git.branch({ dir, ref: "c" })
  await git.checkout({ dir, ref: "c" })
  await helpers.batchUpdateFiles(dir, [["y", "1"], ["z", "2"]])

  const ret = await detectConflict(dir, "a", "b", "c")
  assert(ret.conflicts.length === 0)
})

test("conflict with removed file", async () => {
  const dir = await helpers.createTempGitProject()
  await helpers.batchUpdateFiles(dir, [["x", "0"]])

  await git.branch({ dir, ref: "a" })
  await git.checkout({ dir, ref: "a" })
  await helpers.batchUpdateFiles(dir, [["x", "a"]])

  await git.branch({ dir, ref: "b" })
  await git.checkout({ dir, ref: "b" })
  await pify(fs.unlink)(path.join(dir, "x"))
  await git.remove({ dir, filepath: "x" })
  await git.commit({
    dir,
    message: "Update",
    author: { name: "n", email: "e" }
  })

  await git.checkout({ dir, ref: "a" })
  await git.branch({ dir, ref: "c" })
  await git.checkout({ dir, ref: "c" })
  await helpers.batchUpdateFiles(dir, [["x", "c"]])

  const ret = await detectConflict(dir, "a", "b", "c")
  assert(ret.conflicts.length === 1)
})
