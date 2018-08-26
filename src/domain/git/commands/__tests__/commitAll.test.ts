import * as helpers from "../../__testHelpers__/helpers"

import fs from "fs"
import * as git from "isomorphic-git"
import path from "path"
import assert from "power-assert"
import { commitAll } from "../commitAll"

test("commit all files", async () => {
  const dir = await helpers.createTempGitProject()
  await helpers.batchUpdateFiles(dir, [["a", "1"], ["b", "2"]])
  assert.equal(await git.status({ dir, filepath: "a" }), "unmodified")
  assert.equal(await git.status({ dir, filepath: "b" }), "unmodified")

  // Update a
  // Delete b
  // Add c
  await fs.promises.writeFile(path.join(dir, "a"), "xxx")
  await fs.promises.unlink(path.join(dir, "b"))
  await fs.promises.writeFile(path.join(dir, "c"), "new")

  assert.equal(await git.status({ dir, filepath: "a" }), "*modified")
  assert.equal(await git.status({ dir, filepath: "b" }), "*deleted")
  assert.equal(await git.status({ dir, filepath: "c" }), "*added")

  await commitAll(dir, "Update", { name: "x", email: "y" })

  assert.equal(await git.status({ dir, filepath: "a" }), "unmodified")
  assert.equal(await git.status({ dir, filepath: "b" }), "absent")
  assert.equal(await git.status({ dir, filepath: "c" }), "unmodified")
})
