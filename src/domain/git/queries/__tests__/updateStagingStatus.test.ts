import fs from "fs"
import * as git from "isomorphic-git"
import path from "path"
import assert from "power-assert"
import { getFilesRecursively, removeDirectory } from "../../../filesystem"
import * as helpers from "../../__testHelpers__/helpers"
import { getStagingStatus } from "../getStagingStatus"
import { updateStagingStatus } from "../updateStagingStatus"

test("update", async () => {
  const root = await helpers.createTempGitProject()
  await helpers.batchUpdateFiles(root, [["a", "1"]])
  const initial = await getStagingStatus(root)
  assert.deepEqual(initial, {
    a: "unmodified"
  })

  // Update a
  await fs.promises.writeFile(path.join(root, "a"), "1----")
  await updateStagingStatus(root, initial, ["a"])
  assert.deepEqual(await getStagingStatus(root), {
    a: "*modified"
  })
})

test("update all", async () => {
  const root = await helpers.createTempGitProject()
  await helpers.batchUpdateFiles(root, [["a", "1"]])
  const initial = await getStagingStatus(root)
  assert.deepEqual(initial, {
    a: "unmodified"
  })

  // Update a
  await fs.promises.writeFile(path.join(root, "a"), "1----")
  await updateStagingStatus(root, initial, [])
  assert.deepEqual(await getStagingStatus(root), {
    a: "*modified"
  })
})

test("remove dir", async () => {
  const root = await helpers.createTempGitProject()
  await fs.promises.mkdir(path.join(root, "d"))
  await helpers.batchUpdateFiles(root, [["a", "1"], ["d/x", "1"], ["d/y", "2"]])
  const initial = await getStagingStatus(root)
  assert.deepEqual(initial, {
    a: "unmodified",
    "d/x": "unmodified",
    "d/y": "unmodified"
  })

  const targetFiles = (await getFilesRecursively(path.join(root, "d"))).map(f =>
    path.relative(root, f)
  )

  await removeDirectory(path.join(root, "d"))
  assert.deepEqual(await getStagingStatus(root), {
    a: "unmodified",
    "d/x": "*deleted",
    "d/y": "*deleted"
  })

  for (const filepath of targetFiles) {
    await git.remove({ fs, dir: root, filepath })
  }
  assert.deepEqual(await getStagingStatus(root), {
    a: "unmodified",
    "d/x": "deleted",
    "d/y": "deleted"
  })

  await git.commit({
    fs,
    dir: root,
    message: "x",
    author: { name: "x", email: "y" }
  })

  assert.deepEqual(await getStagingStatus(root), {
    a: "unmodified"
  })

  assert.deepEqual(await updateStagingStatus(root, initial, targetFiles), {
    a: "unmodified"
  })
})
