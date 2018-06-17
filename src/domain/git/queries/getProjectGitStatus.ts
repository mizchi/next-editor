import fs from "fs"
import * as git from "isomorphic-git"
import { GitFileStatus, GitRepositoryStatus } from "./../../types"
import { getGitHistory } from "./getGitHistory"
import { getGitStatus } from "./getGitStatus"
import { getGitTrackingStatus } from "./getGitTrackingStatus"

export async function getProjectGitStatus(
  projectRoot: string
): Promise<GitRepositoryStatus> {
  const trackingStatus = await getGitTrackingStatus(projectRoot)
  const { tracked, untracked } = trackingStatus

  const statusList: GitFileStatus[] = await Promise.all(
    tracked.map(async relpath => {
      const status = await getGitStatus(projectRoot, relpath)
      return { relpath, status, staged: status[0] !== "*" }
    })
  )

  // gather staged changes
  const stagedChanges = statusList.filter(
    a => a.staged && a.status !== "unmodified"
  )
  const unstagedChanges = statusList.filter(a => !a.staged)

  const currentBranch = await git.currentBranch({ fs, dir: projectRoot })
  const branches = await git.listBranches({ fs, dir: projectRoot })
  const history = await getGitHistory(projectRoot, { ref: currentBranch })
  return {
    currentBranch,
    branches,
    stagedChanges,
    unstagedChanges,
    tracked,
    untracked,
    history
  }
}
