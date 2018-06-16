import path from "path"
import * as repo from "../lib/repository"
import { GitRepositoryStatus } from "./../lib/repository"
import { RepositoryState } from "./repository"

const j = path.join

const PATH_CHANGED = "repository:path-changed"
const GIT_CHANGED = "repository:git-changed"
const GIT_STATUS_UPDATED = "repository:git-status-updated"

type PathChanged = {
  type: typeof PATH_CHANGED
  payload: {
    pathname: string
  }
}

type GitChanged = {
  type: typeof GIT_CHANGED
  payload: {
    gitRelativePath: string
  }
}

type GitStatusUpdated = {
  type: typeof GIT_STATUS_UPDATED
  payload: GitRepositoryStatus
}

export function pathChanged(pathname: string): PathChanged {
  return {
    type: PATH_CHANGED,
    payload: {
      pathname
    }
  }
}

export function gitChanged(gitRelativePath: string): GitChanged {
  return {
    type: GIT_CHANGED,
    payload: {
      gitRelativePath
    }
  }
}

export async function updateGitStatus(
  projectRoot: string
): Promise<GitStatusUpdated> {
  return {
    type: GIT_STATUS_UPDATED,
    payload: await repo.getProjectGitStatus(projectRoot)
  }
}

export async function createFile(
  aPath: string,
  content: string = ""
): Promise<PathChanged> {
  await repo.writeFile(aPath, content)
  const dirname = path.dirname(aPath)
  return pathChanged(dirname)
}

export async function createBranch(projectRoot: string, newBranchName: string) {
  const branches = await repo.listBranches(projectRoot)
  if (!branches.includes(newBranchName)) {
    await repo.createBranch(projectRoot, newBranchName)
    console.log("create branch", newBranchName)
    return gitChanged(".")
  } else {
    console.error(`Git: Creating branch existed: ${newBranchName}`)
  }
}

export async function checkoutBranch(projectRoot: string, branchName: string) {
  const branches = await repo.listBranches(projectRoot)
  if (branches.includes(branchName)) {
    await repo.checkoutBranch(projectRoot, branchName)
    return gitChanged(".")
  } else {
    console.error(`Git: Unknown branch: ${branchName}`)
  }
}

export async function updateFile(aPath: string, content: string) {
  await repo.writeFile(aPath, content)
  const dirname = path.dirname(aPath)
  return pathChanged(dirname)
}

export async function createDirectory(aPath: string) {
  await repo.mkdir(aPath)
  const dirname = path.dirname(aPath)
  return pathChanged(dirname)
}

export async function deleteFile(aPath: string) {
  await repo.unlink(aPath)
  const dirname = path.dirname(aPath)
  return pathChanged(dirname)
}

export async function addToStage(projectRoot: string, relpath: string) {
  await repo.addFileInRepository(projectRoot, relpath)
  const dirname = path.dirname(j(projectRoot, relpath))
  return pathChanged(dirname)
}

export async function commitChanges(
  projectRoot: string,
  message: string = "Update"
) {
  const author = {}
  const hash = await repo.commitChanges(projectRoot, message)
  return pathChanged(projectRoot)
}

type Action = PathChanged | GitChanged | GitStatusUpdated

export type RepositoryState = {
  gitRepositoryStatus: GitRepositoryStatus | null
  currentProjectRoot: string
  lastChangedPath: string
  lastChangedGithPath: string
  touchCounter: number
  gitTouchCounter: number
}

const initialState: RepositoryState = {
  gitRepositoryStatus: null,
  currentProjectRoot: "/playground",
  gitTouchCounter: 0,
  lastChangedGithPath: "",
  lastChangedPath: "/playground",
  touchCounter: 0
}

export function reducer(state: RepositoryState = initialState, action: Action) {
  switch (action.type) {
    case PATH_CHANGED: {
      return {
        ...state,
        lastChangedPath: action.payload.pathname,
        touchCounter: state.touchCounter + 1
      }
    }
    case GIT_CHANGED: {
      return {
        ...state,
        gitTouchCounter: state.gitTouchCounter + 1,
        lastChangedGitPath: action.payload.gitRelativePath
      }
    }
    case GIT_STATUS_UPDATED: {
      return {
        ...state,
        gitRepositoryStatus: action.payload
      }
    }
    default: {
      return state
    }
  }
}
