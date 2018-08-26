import "../../__testHelpers__"

import fs from "fs"
import path from "path"
import assert from "power-assert"
import * as helpers from "../../__testHelpers__/helpers"
import { isIgnored } from "../isIgnored"

test("list files", async () => {
  const root = await helpers.createTempGitProject()
  await fs.promises.mkdir(path.join(root, "public"))
  await helpers.batchUpdateFiles(root, [
    ["a", "1"],
    [".gitignore", "b\npublic"]
  ])
  await fs.promises.writeFile(path.join(root, "b"), "2")
  await fs.promises.writeFile(path.join(root, "public/out"), "out")
  assert(await isIgnored(root, "b"))
  assert(await isIgnored(root, "public/out"))
})
