import fs from "fs"
import * as git from "isomorphic-git"
import difference from "lodash/difference"
import { getFilesRecursively } from "../../filesystem/queries/getFileRecursively"
import { GitTrackingStatus } from "./../../types"

export async function getGitTrackingStatus(
  projectRoot: string
): Promise<GitTrackingStatus> {
  // buffer
  const untracked = []
  const tracked = []

  const gitFiles: string[] = await git.listFiles({ fs, dir: projectRoot })
  const gitFilepathIndexed: { [s: string]: boolean } = gitFiles.reduce(
    (acc: { [s: string]: boolean }, pathname: string) => {
      const relpath = pathname.replace(projectRoot, "")
      return { ...acc, [relpath]: true }
    },
    {}
  )

  const allFiles = await getFilesRecursively(projectRoot)
  const relativeFilepaths = allFiles.map(pathname =>
    pathname.replace(projectRoot + "/", "")
  )

  for (const relpath of relativeFilepaths) {
    if (gitFilepathIndexed[relpath]) {
      tracked.push(relpath)
    } else {
      untracked.push(relpath)
    }
  }

  const removedInTrack = difference(gitFiles, relativeFilepaths)
  console.log("removedInTrack", removedInTrack)
  return {
    tracked,
    untracked,
    removedInTrack
  }
}
