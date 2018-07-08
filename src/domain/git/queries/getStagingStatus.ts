import { GitFileStatus, GitStagingStatus, GitStatusString } from "../../types"
import { arrangeRawStatus } from "./arrangeRawStatus"
import { getFileStatus } from "./getFileStatus"
import { getTrackingStatus } from "./getTrackingStatus"

export async function getStagingStatus(
  projectRoot: string,
  callback: (s: GitFileStatus) => void = () => void 0
): Promise<GitStagingStatus> {
  const { tracked } = await getTrackingStatus(projectRoot)
  const raw = await Promise.all(
    tracked.map(async relpath => {
      const status = await getFileStatus(projectRoot, relpath)
      const ret = { relpath, status, staged: isStaged(status) }
      callback(ret)
      return ret
    })
  )
  const { staged, unstaged, unmodified } = arrangeRawStatus(raw)
  return {
    raw,
    unstaged,
    staged,
    unmodified
  }
}

function isStaged(status: GitStatusString | "error"): boolean {
  const firstChar = status[0]
  return firstChar !== "*"
}
