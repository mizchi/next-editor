import fs from "fs"
import * as git from "isomorphic-git"
import { CommitDescription } from "./../../types"

export async function isFastForward(
  dir: string,
  refA: string,
  refB: string
): Promise<
  | {
      fastForward: false
    }
  | {
      fastForward: true
      self: boolean
      commits: CommitDescription[]
    }
> {
  const logA: CommitDescription[] = await git.log({ fs, dir, ref: refA })
  const logB: CommitDescription[] = await git.log({ fs, dir, ref: refB })
  const fastForward: boolean = isFastForwardByCommits(logA, logB)
  if (fastForward) {
    const oid = logA[logA.length - 1].oid
    const index = logB.findIndex(i => i.oid === oid)
    return {
      fastForward: true,
      self: logA[0].oid === logB[0].oid,
      commits: logB.slice(index)
    }
  } else {
    return {
      fastForward: false
    }
  }
}

export function isFastForwardByCommits(
  logA: CommitDescription[],
  logB: CommitDescription[]
): boolean {
  const base = logA.map(i => i.oid).reverse()
  const other = logB.map(i => i.oid).reverse()

  const root = base[0]
  const diff = other.findIndex(o => o === root)
  if (diff === -1) {
    return false
  }

  return base.every((a, i) => {
    const b = other[diff + i]
    return a === b
  })
}
