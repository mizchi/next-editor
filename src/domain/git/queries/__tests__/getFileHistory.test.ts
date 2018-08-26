import "../../__testHelpers__"

import assert from "power-assert"
import * as helpers from "../../__testHelpers__/helpers"
import { getFileHistory, getFileHistoryWithDiff } from "../getFileHistory"

test("list up file changes", async () => {
  const dir = await helpers.createTempGitProject()
  await helpers.batchUpdateFiles(dir, [["b", "__x"]], "init")
  const c1id = await helpers.batchUpdateFiles(dir, [["a", "init"], ["b", "2"]])
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

test("with diff", async () => {
  const dir = await helpers.createTempGitProject()
  await helpers.batchUpdateFiles(dir, [["a", "a"]])
  await helpers.batchUpdateFiles(dir, [["a", "a\nb"]])
  await helpers.batchUpdateFiles(dir, [["a", "a\nb\nc"]])
  await helpers.batchUpdateFiles(dir, [["a", "a\nb\nd"]])

  const fileChangesWithDiff = await getFileHistoryWithDiff(dir, "master", "a")

  assert.deepEqual(fileChangesWithDiff.map(change => change.diff), [
    [{ count: 1, added: true, removed: undefined, value: "a" }],
    [
      { count: 1, added: undefined, removed: true, value: "a" },
      { count: 2, added: true, removed: undefined, value: "a\nb" }
    ],
    [
      { count: 1, value: "a\n" },
      { count: 1, added: undefined, removed: true, value: "b" },
      { count: 2, added: true, removed: undefined, value: "b\nc" }
    ],
    [
      { count: 2, value: "a\nb\n" },
      { count: 1, added: undefined, removed: true, value: "c" },
      { count: 1, added: true, removed: undefined, value: "d" }
    ]
  ])
})
