import "../../__testHelpers__"

import fs from "fs"
import path from "path"
import assert from "power-assert"
import { getStagingStatus } from "../../queries/getStagingStatus"
import { commitAll } from "../commitAll"

import * as helpers from "../../__testHelpers__/helpers"

test("commit all files", async () => {
  const root = await helpers.createTempGitProject()
  await helpers.batchUpdateFiles(root, [["a", "1"], ["b", "2"]])
  assert.deepEqual(await getStagingStatus(root), {
    a: "unmodified",
    b: "unmodified"
  })

  // Update a
  // Remove b
  // Add c
  await fs.promises.writeFile(path.join(root, "a"), "xxx")
  await fs.promises.writeFile(path.join(root, "c"), "new")
  await fs.promises.unlink(path.join(root, "b"))

  // get staging status
  const staging = await getStagingStatus(root)

  // asset changed status
  assert.deepEqual(staging, {
    a: "*modified",
    b: "*deleted",
    c: "*added"
  })
  await commitAll(root, "Update", { name: "x", email: "y" })

  assert.deepEqual(await getStagingStatus(root), {
    a: "unmodified",
    c: "unmodified"
  })
})
