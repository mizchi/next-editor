import diff3Merge from "diff3"
import * as git from "isomorphic-git"
import uniq from "lodash/uniq"
// tslint:disable-next-line
import { getRefOids } from "./getRefOids"

export async function detectConflict(
  dir: string,
  refA: string,
  refB: string,
  refC: string
) {
  const aOids = await getRefOids(dir, refA)
  const bOids = await getRefOids(dir, refB)
  const cOids = await getRefOids(dir, refC)
  const f = (ret: { filepath: string }) => ret.filepath
  const allFiles = uniq([...aOids.map(f), ...bOids.map(f), ...cOids.map(f)])

  const conflicts: Array<{ filepath: string; diff: any }> = []
  for (const filepath of allFiles) {
    const aOid = aOids.find(i => i.filepath === filepath)
    const bOid = bOids.find(i => i.filepath === filepath)
    const cOid = cOids.find(i => i.filepath === filepath)

    // same object
    if (bOid && cOid && bOid.oid === cOid.oid) {
      continue
    }

    let a = ""
    let b = ""
    let c = ""

    if (aOid) {
      const { object } = await git.readObject({
        dir,
        oid: aOid.oid
      })
      a = object.toString()
    }

    if (bOid) {
      const { object } = await git.readObject({
        dir,
        oid: bOid.oid
      })
      b = object.toString()
    }
    if (cOid) {
      const { object } = await git.readObject({
        dir,
        oid: cOid.oid
      })
      c = object.toString()
    }

    const diff = diff3Merge(b.split("\n"), a.split("\n"), c.split("\n"))
    const hasConflict = diff.some((i: any) => i.conflict)
    if (hasConflict) {
      conflicts.push({
        filepath,
        diff
      })
    }
  }

  return {
    conflicts,
    conflict: conflicts.length > 0
  }
}
