import fs from "fs"
import path from "path"
import assert from "power-assert"
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
