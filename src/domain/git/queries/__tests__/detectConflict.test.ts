import fs from "fs"
import * as git from "isomorphic-git"
import assert from "power-assert"
import diff from "wu-diff-js"
// tslint:disable-next-line
import * as helpers from "../../__testHelpers__/helpers"
import { getRefOids } from "../getRefOids"

test("hasConflict", async () => {
  const dir = await helpers.createTempGitProject()
  await helpers.batchUpdateFiles(dir, [["x", "0"]])

  await git.branch({ fs, dir, ref: "a" })
  await git.checkout({ fs, dir, ref: "a" })
  await helpers.batchUpdateFiles(dir, [["x", "a"]])

  await git.branch({ fs, dir, ref: "b" })
  await git.checkout({ fs, dir, ref: "b" })
  await helpers.batchUpdateFiles(dir, [["x", "a\nb"]])

  await git.checkout({ fs, dir, ref: "a" })
  await git.branch({ fs, dir, ref: "c" })
  await git.checkout({ fs, dir, ref: "c" })
  await helpers.batchUpdateFiles(dir, [["x", "a\nc"]])

  const [our] = await getRefOids(dir, "a")
  const [they1] = await getRefOids(dir, "b")
  const [they2] = await getRefOids(dir, "c")

  const { object: ours } = await git.readObject({ fs, dir, oid: our.oid })
  const { object: theirs1 } = await git.readObject({
    fs,
    dir,
    oid: they1.oid
  })

  const { object: theirs2 } = await git.readObject({
    fs,
    dir,
    oid: they2.oid
  })

  // create diff
  const diffAB = diff(
    ours.toString().split("\n"),
    theirs1.toString().split("\n")
  )
  const diffAC = diff(
    ours.toString().split("\n"),
    theirs2.toString().split("\n")
  )

  assert.deepEqual(diffAB, [
    { type: "common", value: "a" },
    { type: "added", value: "b" }
  ])
  assert.deepEqual(diffAC, [
    { type: "common", value: "a" },
    { type: "added", value: "c" }
  ])
  // WIP: Validate them

  // use diff3merge
  const diff3Merge = require("diff3")
  const diff3 = diff3Merge(
    ours.toString().split("\n"),
    theirs1.toString().split("\n"),
    theirs2.toString().split("\n")
  )

  const hasConflict = diff3.some(i => i.conflict)
  assert(hasConflict)
})
