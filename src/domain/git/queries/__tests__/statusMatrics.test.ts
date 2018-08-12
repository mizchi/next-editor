import fs from "fs"
import * as git from "isomorphic-git"
import * as helpers from "../../__testHelpers__/helpers"

test("no conflict", async () => {
  const dir = await helpers.createTempGitProject()
  await helpers.batchUpdateFiles(dir, [["x", "a"], ["y", "bb"], ["z", "ccc"]])
  // await helpers.batchUpdateFiles(dir, [["x", "a"]])
  const mat = await (git as any).statusMatrix({ fs, dir })
  console.log(mat)
})
