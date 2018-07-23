import assert from "power-assert"
import * as helpers from "../../__testHelpers__/helpers"
import { getFileHistory } from "../getFileHistory"

test("list up file changes", async () => {
  const dir = await helpers.createTempGitProject()
  await helpers.batchUpdateFiles(dir, [["b", "__x"]], "init")
  const c1id = await helpers.batchUpdateFiles(dir, [["a", "itit"], ["b", "2"]])
  const c2id = await helpers.batchUpdateFiles(dir, [["a", "x"]], "x")
  await helpers.batchUpdateFiles(dir, [["b", "__y"]], "none") // will be ignored
  const c4id = await helpers.batchUpdateFiles(dir, [["a", "y"]], "y")
  const c5id = await helpers.batchUpdateFiles(dir, [["a", "z"]], "z")

  const fileChanges = await getFileHistory(dir, "master", "a")
  assert.deepEqual(fileChanges.map((c: any) => c.commit.oid), [
    c1id,
    c2id,
    c4id,
    c5id
  ])
})

test("return [] if file is not on git", async () => {
  const dir = await helpers.createTempGitProject()
  await helpers.batchUpdateFiles(dir, [["b", "__x"]], "init")

  const fileChanges = await getFileHistory(dir, "master", "_eoauhsoaidsai")
  assert(fileChanges.length === 0)
})
