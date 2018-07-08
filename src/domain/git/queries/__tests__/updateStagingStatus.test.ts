import fs from "fs"
import path from "path"
import assert from "power-assert"
import * as helpers from "../../__testHelpers__/helpers"
import { getStagingStatus } from "../getStagingStatus"
import { updateStagingStatus } from "../updateStagingStatus"

test("updateStagingStatus", async () => {
  const root = await helpers.createTempGitProject()
  await helpers.batchUpdateFiles(root, [["a", "1"], ["b", "2"]])
  const status0 = await getStagingStatus(root)
  assert.deepEqual(status0.unmodified, ["a", "b"])

  // Update a
  await fs.promises.writeFile(path.join(root, "a"), "1----")
  await updateStagingStatus(root, status0, ["a"])
  const status1 = await getStagingStatus(root)
  assert.deepEqual(status1.modified, ["a"])
  assert.deepEqual(status1.unmodified, ["b"])
})