import { GitStagingStatus, GitStatusString } from "../../types"
import { GitFileStatus } from "./../../types"
import { getGitStatus } from "./getGitStatus"
import { getTrackingStatus } from "./getTrackingStatus"

export async function getStagingStatus(
  projectRoot: string,
  callback: (s: GitFileStatus) => void = () => void 0
): Promise<GitStagingStatus> {
  const { tracked } = await getTrackingStatus(projectRoot)

  const raw = await Promise.all(
    tracked.map(async relpath => {
      const status = await getGitStatus(projectRoot, relpath)
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

export async function updateStagingStatus(
  projectRoot: string,
  relpaths: string[],
  status: GitStagingStatus
): Promise<GitStagingStatus> {
  const newRaw = status.raw.slice()
  for (const relpath of relpaths) {
    const newStatus = {
      relpath,
      staged: false,
      status: await getGitStatus(projectRoot, relpath)
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

function arrangeRawStatus(
  raw: GitFileStatus[]
): { staged: string[]; unstaged: string[]; unmodified: string[] } {
  const staged = raw
    .filter(a => a.staged && a.status !== "unmodified")
    .map(a => a.relpath)

  const unmodified = raw
    .filter(a => a.status === "unmodified")
    .map(a => a.relpath)

  const unstaged = raw.filter(a => !a.staged).map(a => a.relpath)
  return { staged, unstaged, unmodified }
}

function isStaged(status: GitStatusString | "error"): boolean {
  const firstChar = status[0]
  return firstChar !== "*"
}
