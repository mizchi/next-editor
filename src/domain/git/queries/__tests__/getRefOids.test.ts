import fs from "fs"
import * as git from "isomorphic-git"
import path from "path"
import assert from "power-assert"
import * as helpers from "../../__testHelpers__/helpers"
import { getRefOids, searchTree } from "../getRefOids"

test("searchTree", async () => {
  const root = await helpers.createTempGitProject()
  fs.mkdirSync(path.join(root, "b"))
  fs.mkdirSync(path.join(root, "b/c"))
  await helpers.batchUpdateFiles(root, [
    ["a", "x"],
    ["b/d", "y"],
    ["b/e", "z"],
    ["b/c/f", "α"]
  ])

  const repo = { fs, dir: root }
  const sha = await git.resolveRef({ ...repo, ref: "master" })
  const { object: commit } = await git.readObject({ ...repo, oid: sha })

  const oids = await searchTree(root, commit.tree)
  assert.deepEqual(oids.map(o => o.filepath), ["a", "b/c/f", "b/d", "b/e"])

  const oid = oids[0].oid
  const { object: blob } = await git.readObject({ oid, fs, dir: root })
  assert(blob.toString() === "x")
})

test("getRefOids", async () => {
  const root = await helpers.createTempGitProject()
  fs.mkdirSync(path.join(root, "b"))
  fs.mkdirSync(path.join(root, "b/c"))
  await helpers.batchUpdateFiles(root, [["a", "x"], ["b/c/d", "y"]])
  const oids = await getRefOids(root, "master")
  assert.deepEqual(oids.map(o => o.filepath), ["a", "b/c/d"])

  // update
  await helpers.batchUpdateFiles(root, [["c", "added"]])
  const oids2 = await getRefOids(root, "master")
  assert.deepEqual(oids2.map(o => o.filepath), ["a", "b/c/d", "c"])
})
