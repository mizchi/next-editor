import fs from "fs"
import * as git from "isomorphic-git"
import {
  GitFileStatus,
  GitRepositoryStatus,
  GitStatusString
} from "../../types"
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

  const {
    staged,
    unstaged,
    unmodified,
    rawStatusList
  } = await getFileStatusInProject(projectRoot, tracked)

  return {
    rawStatusList,
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

export async function getFileStatusInProject(
  projectRoot: string,
  tracked: string[]
) {
  const rawStatusList: GitFileStatus[] = await Promise.all(
    tracked.map(async relpath => {
      const status = await getGitStatus(projectRoot, relpath)
      return { relpath, status, staged: isStaged(status) }
    })
  )
  const { staged, unstaged, unmodified } = getStagingStatus(rawStatusList)
  return {
    rawStatusList,
    staged,
    unstaged,
    unmodified
  }
}

export async function updateFileStatusInProject(
  projectRoot: string,
  repositoryStatus: GitRepositoryStatus,
  relpath: string
): Promise<GitRepositoryStatus> {
  const newChange = {
    relpath,
    staged: false,
    status: await getGitStatus(projectRoot, relpath)
  }

  const rawStatusList = [...repositoryStatus.rawStatusList]
  const changedIndex = rawStatusList.findIndex(c => c.relpath === relpath)
  if (changedIndex > -1) {
    // update status
    rawStatusList[changedIndex] = newChange
  }

  const { staged, unstaged, unmodified } = getStagingStatus(rawStatusList)
  return {
    ...repositoryStatus,
    // untracked,
    rawStatusList,
    staged,
    unmodified,
    unstaged
  }
}

function isStaged(status: GitStatusString | "error"): boolean {
  const firstChar = status[0]
  return firstChar !== "*"
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
