import { GitStagingStatus, GitStatusString } from "../../types"
import { getFileStatus } from "./getFileStatus"
import { getRepositoryFiles } from "./getRepositoryFiles"

type FileStatus = { filepath: string; status: GitStatusString }

export async function getStagingStatus(
  projectRoot: string,
  callback?: (s: FileStatus) => void
): Promise<GitStagingStatus> {
  const relpaths = await getRepositoryFiles(projectRoot)

  const list: FileStatus[] = await Promise.all(
    relpaths.map(async relpath => {
      const status = await getFileStatus(projectRoot, relpath)
      const ret = { filepath: relpath, status }
      callback && callback(ret)
      return ret
    })
  )

  return list.reduce((acc: GitStagingStatus, { filepath, status }) => {
    return {
      ...acc,
      [filepath]: status
    }
  }, {})
}
