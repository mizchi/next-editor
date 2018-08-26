import "../../__testHelpers__"

import fs from "fs"
import path from "path"
import assert from "power-assert"
import * as helpers from "../../__testHelpers__/helpers"
import { getRepositoryFiles } from "../getRepositoryFiles"

test("list files", async () => {
  const root = await helpers.createTempGitProject()
  await helpers.batchUpdateFiles(root, [["a", "1"], ["b", "2"]])
  const files = await getRepositoryFiles(root)
  assert.deepEqual(files, ["a", "b"])
})

test("list files with deleted", async () => {
  const root = await helpers.createTempGitProject()
  await helpers.batchUpdateFiles(root, [["a", "1"], ["b", "2"]])
  await fs.promises.unlink(path.join(root, "a"))
  const files = await getRepositoryFiles(root)
  assert.deepEqual(files, ["a", "b"])
})
