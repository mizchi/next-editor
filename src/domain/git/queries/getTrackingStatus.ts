import fs from "fs"
import * as git from "isomorphic-git"
import difference from "lodash/difference"
import uniq from "lodash/uniq"
import { getFilesRecursively } from "../../filesystem/queries/getFileRecursively"
import { GitTrackingStatus } from "../../types"

export async function getTrackingStatus(
  projectRoot: string
): Promise<GitTrackingStatus> {
  const trackedByHead: string[] = await git.listFiles({
    fs,
    dir: projectRoot,
    ref: "HEAD"
  })

  const trackedByIndex: string[] = await git.listFiles({
    fs,
    dir: projectRoot
  })

  const tracked = uniq([...trackedByHead, ...trackedByIndex])

  const files = (await getFilesRecursively(projectRoot)).map(pathname =>
    pathname.replace(projectRoot + "/", "")
  )

  const untracked = difference(files, tracked)

  return {
    tracked,
    untracked
  }
}

export async function getUntrackingFiles(
  projectRoot: string
): Promise<string[]> {
  const tracked: string[] = await git.listFiles({
    fs,
    dir: projectRoot,
    ref: "HEAD"
  })

  const files = (await getFilesRecursively(projectRoot)).map(pathname =>
    pathname.replace(projectRoot + "/", "")
  )

  return difference(files, tracked)
}
