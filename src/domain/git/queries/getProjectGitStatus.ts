import fs from "fs"
import * as git from "isomorphic-git"
import { getGitStatusInRepository } from "./getGitStatusInRepository"
import { GitRepositoryStatus, GitStagingStatus } from "./../../types"
import { getGitTrackingStatus } from "./getGitTrackingStatus"
import { getLogInRepository } from "./getLogInRepository"

export async function getProjectGitStatus(
  projectRoot: string
): Promise<GitRepositoryStatus> {
  const trackingStatus = await getGitTrackingStatus(projectRoot)
  const { tracked, removedInTrack } = trackingStatus

  const fileStatusList: Array<{
    relpath: string
    status: string
  }> = await Promise.all(
    [...tracked, ...removedInTrack].map(async relpath => {
      const status = await getGitStatusInRepository(projectRoot, relpath)
      return { relpath, status }
    })
  )
  const stagingStatus: GitStagingStatus = fileStatusList.reduce(
    (acc: GitStagingStatus, fileStatus) => {
      console.log("status:", fileStatus.relpath, fileStatus.status)
      switch (fileStatus.status) {
        case "*deleted": {
          return {
            ...acc,
            removedInFS: [...acc.removedInFS, fileStatus.relpath]
          }
        }
        case "deleted": {
          return {
            ...acc,
            removed: [...acc.removed, fileStatus.relpath]
          }
        }
        case "*modified": {
          return { ...acc, modified: [...acc.modified, fileStatus.relpath] }
        }
        case "added": {
          return { ...acc, added: [...acc.added, fileStatus.relpath] }
        }
        // added and modified
        case "*added": {
          return {
            ...acc,
            added: [...acc.added, fileStatus.relpath],
            modified: [...acc.modified, fileStatus.relpath]
          }
        }
        case "modified": {
          return { ...acc, staged: [...acc.staged, fileStatus.relpath] }
        }
        case "unmodified": {
          return { ...acc, unmodified: [...acc.unmodified, fileStatus.relpath] }
        }
        default: {
          console.log("other")
          return acc
        }
      }
    },
    {
      removed: [],
      removedInFS: [],
      added: [],
      modified: [],
      staged: [],
      unmodified: []
    }
  )

  const currentBranch = await git.currentBranch({ fs, dir: projectRoot })
  const branches = await git.listBranches({ fs, dir: projectRoot })
  const history = await getLogInRepository(projectRoot, { ref: currentBranch })
  return {
    branches,
    currentBranch,
    stagingStatus,
    trackingStatus,
    history
  }
}
