import { GitFileStatus, GitStagingStatus, GitStatusString } from "../../types"
import { arrangeRawStatus } from "./arrangeRawStatus"
import { getFileStatus } from "./getFileStatus"
import { getRepositoryFiles } from "./getRepositoryFiles"

export async function getStagingStatus(
  projectRoot: string,
  callback?: (s: GitFileStatus) => void
): Promise<GitStagingStatus> {
  const relpaths = await getRepositoryFiles(projectRoot)

  const raw = await Promise.all(
    relpaths.map(async relpath => {
      const status = await getFileStatus(projectRoot, relpath)
      const ret = { relpath, status, staged: isStaged(status) }
      callback && callback(ret)
      return ret
    })
  )

  const { staged, modified, unmodified } = arrangeRawStatus(raw)
  return {
    raw,
    modified,
    staged,
    unmodified
  }
}

function isStaged(status: GitStatusString | "error"): boolean {
  const firstChar = status[0]
  return firstChar !== "*"
}
