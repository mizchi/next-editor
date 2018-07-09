import fs from "fs"
import * as git from "isomorphic-git"
import assert from "power-assert"
import * as helpers from "../../__testHelpers__/helpers"
import { isFastForward, isFastForwardByCommits } from "../isFastForward"
import { CommitDescription } from "./../../../types"

test("check isFastForward", async () => {
  const dir = await helpers.createTempGitProject()
  await helpers.batchUpdateFiles(dir, [["a", "1"]])
  await git.branch({ fs, dir, ref: "a" })
  await git.checkout({ fs, dir, ref: "a" })
  await helpers.batchUpdateFiles(dir, [["a", "2"]])
  const logA: CommitDescription[] = await git.log({ fs, dir, ref: "a" })
  await git.branch({ fs, dir, ref: "b" })
  await git.checkout({ fs, dir, ref: "b" })
  await helpers.batchUpdateFiles(dir, [["a", "3"]])

  const logB: CommitDescription[] = await git.log({ fs, dir, ref: "b" })

  assert(isFastForwardByCommits(logA, logB))
  assert(!isFastForwardByCommits(logB, logA))

  // not fast forward
  await git.checkout({ fs, dir, ref: "a" })
  await helpers.batchUpdateFiles(dir, [["a", "4"]])
  const logA2: CommitDescription[] = await git.log({ fs, dir, ref: "a" })

  assert(!isFastForwardByCommits(logA2, logB))
})

test("check isFastForward", async () => {
  const dir = await helpers.createTempGitProject()
  await helpers.batchUpdateFiles(dir, [["a", "1"]])
  await git.branch({ fs, dir, ref: "a" })
  await git.checkout({ fs, dir, ref: "a" })
  await helpers.batchUpdateFiles(dir, [["a", "2"]])
  await git.branch({ fs, dir, ref: "b" })
  await git.checkout({ fs, dir, ref: "b" })
  await helpers.batchUpdateFiles(dir, [["a", "3"]])

  assert.deepEqual(await isFastForward(dir, "b", "a"), {
    fastForward: false
  })
  const ret: any = await isFastForward(dir, "a", "b")
  assert(ret.fastForward)
  assert(ret.commits.length === 1)
})
