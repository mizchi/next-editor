import fs from "fs"
import * as git from "isomorphic-git"
import {
  GitFileStatus,
  GitRepositoryStatus,
  GitStatusString
} from "./../../types"
import { getGitHistory } from "./getGitHistory"
import { getGitStatus } from "./getGitStatus"
import { getGitTrackingStatus } from "./getGitTrackingStatus"

export async function getProjectGitStatus(
  projectRoot: string
): Promise<GitRepositoryStatus> {
  // branching
  const currentBranch = await git.currentBranch({ fs, dir: projectRoot })
  const branches = await git.listBranches({ fs, dir: projectRoot })
  const history = await getGitHistory(projectRoot, { ref: currentBranch })

  // staging
  const trackingStatus = await getGitTrackingStatus(projectRoot)
  const { tracked, untracked } = trackingStatus

  const statusList: GitFileStatus[] = await Promise.all(
    tracked.map(async relpath => {
      const status = await getGitStatus(projectRoot, relpath)
      return { relpath, status, staged: isStaged(status) }
    })
  )

  const { staged, unstaged, unmodified } = getStagingStatus(statusList)

  return {
    rawStatusList: statusList,
    unstaged,
    staged,
    currentBranch,
    branches,
    tracked,
    untracked,
    unmodified,
    history
  }
}

export async function updateFileStatusInProject(
  projectRoot: string,
  repositoryStatus: GitRepositoryStatus,
  relpath: string
): Promise<GitRepositoryStatus> {
  const { tracked, rawStatusList } = repositoryStatus

  // detect new untracked file
  // unstaged absent => unstaged *add
  if (!tracked.includes(relpath)) {
    const newChange = {
      relpath,
      staged: false,
      status: await getGitStatus(projectRoot, relpath)
    }
    return {
      ...repositoryStatus,
      rawStatusList: [...rawStatusList, newChange],
      unstaged: [...repositoryStatus.unstaged, ""]
    }
  }

  const statusList = await Promise.all(
    rawStatusList.map(async change => {
      if (change.relpath === relpath) {
        const status = await getGitStatus(projectRoot, relpath)
        return {
          ...change,
          staged: isStaged(status),
          status
        }
      } else {
        return change
      }
    })
  )

  const { staged, unstaged, unmodified } = getStagingStatus(statusList)

  return {
    ...repositoryStatus,
    rawStatusList: statusList,
    staged,
    unmodified,
    unstaged
  }
}

function isStaged(status: GitStatusString | "error"): boolean {
  return status[0] !== "*"
}

function getStagingStatus(
  statusList: GitFileStatus[]
): { staged: string[]; unstaged: string[]; unmodified: string[] } {
  const staged = statusList
    .filter(a => a.staged && a.status !== "unmodified")
    .map(a => a.relpath)

  const unmodified = statusList
    .filter(a => a.status === "unmodified")
    .map(a => a.relpath)

  const unstaged = statusList.filter(a => !a.staged).map(a => a.relpath)
  return { staged, unstaged, unmodified }
}
