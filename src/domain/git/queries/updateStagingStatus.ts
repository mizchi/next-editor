import { GitStagingStatus } from "../../types"
import { getFileStatus } from "./getFileStatus"
import { getStagingStatus } from "./getStagingStatus"

export async function updateStagingStatus(
  projectRoot: string,
  status: GitStagingStatus,
  relpaths: string[]
): Promise<GitStagingStatus> {
  // return getStagingStatus(projectRoot)
  if (relpaths.length === 0) {
    return getStagingStatus(projectRoot)
  }
  const list = await Promise.all(
    relpaths.map(async relpath => {
      return [relpath, await getFileStatus(projectRoot, relpath)]
    })
  )
  const newStatus: GitStagingStatus = { ...status }
  for (const [relpath, s] of list) {
    if (s === "absent") {
      delete (newStatus as any)[relpath]
    } else {
      ;(newStatus as any)[relpath] = s
    }
  }
  return newStatus
}
