import { GitStagingStatus } from "../../types"
import { arrangeRawStatus } from "./arrangeRawStatus"
import { getFileStatus } from "./getFileStatus"

export async function updateStagingStatus(
  projectRoot: string,
  status: GitStagingStatus,
  relpaths: string[]
): Promise<GitStagingStatus> {
  const newRaw = status.raw.slice()
  for (const relpath of relpaths) {
    const newStatus = {
      relpath,
      staged: false,
      status: await getFileStatus(projectRoot, relpath)
    }
    const changedIndex = newRaw.findIndex(c => c.relpath === relpath)
    if (changedIndex > -1) {
      newRaw[changedIndex] = newStatus
    }
  }
  const { staged, unstaged, unmodified } = arrangeRawStatus(newRaw)
  return {
    raw: newRaw,
    unstaged,
    staged,
    unmodified
  }
}
