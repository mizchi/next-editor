import path from "path"
import * as repo from "../lib/repository"
import { GitRepositoryStatus } from "./../lib/repository"
import { RepositoryState } from "./repository"

type ThunkAction<A> = (
  dispatch: (a: A) => void | Promise<void>
) => void | Promise<void>

const j = path.join

const CHANGED = "repository:changed"
const GIT_STATUS_UPDATED = "repository:git-status-updated"

type Changed = {
  type: typeof CHANGED
  payload: {
    git?: boolean
    file?: boolean
    changedPath?: string
  }
}

type GitStatusUpdated = {
  type: typeof GIT_STATUS_UPDATED
  payload: GitRepositoryStatus
}

export function changed({
  git = true,
  file = true,
  changedPath = "/"
}: {
  git?: boolean
  file?: boolean
  changedPath?: string
} = {}): Changed {
  return {
    type: CHANGED,
    payload: {
      git,
      file,
      changedPath
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
): Promise<Changed> {
  await repo.writeFile(aPath, content)
  const dirname = path.dirname(aPath)
  return changed({ changedPath: dirname })
}

export async function createBranch(projectRoot: string, newBranchName: string) {
  const branches = await repo.listBranches(projectRoot)
  if (!branches.includes(newBranchName)) {
    await repo.createBranch(projectRoot, newBranchName)
    console.log("create branch", newBranchName)
    return changed()
  } else {
    console.error(`Git: Creating branch existed: ${newBranchName}`)
  }
}

export function checkoutBranch(
  projectRoot: string,
  branchName: string
): ThunkAction<Changed> {
  return async dispatch => {
    const branches = await repo.listBranches(projectRoot)
    if (branches.includes(branchName)) {
      await repo.checkoutBranch(projectRoot, branchName)
      dispatch(changed())
    } else {
      console.error(`Git: Unknown branch: ${branchName}`)
    }
  }
}

export async function updateFile(
  aPath: string,
  content: string
): Promise<Changed> {
  await repo.writeFile(aPath, content)
  const dirname = path.dirname(aPath)
  return changed({ changedPath: dirname })
}

export async function createDirectory(aPath: string) {
  await repo.mkdir(aPath)
  const dirname = path.dirname(aPath)
  return changed({ changedPath: dirname })
}

export async function deleteFile(aPath: string) {
  await repo.unlink(aPath)
  const dirname = path.dirname(aPath)
  return changed({ changedPath: dirname })
}

export async function addToStage(
  projectRoot: string,
  relpath: string
): Promise<Changed> {
  await repo.addFileInRepository(projectRoot, relpath)
  const dirname = path.dirname(j(projectRoot, relpath))
  return changed({ changedPath: dirname })
}

export async function removeFromGit(
  projectRoot: string,
  relpath: string
): Promise<Changed> {
  await repo.removeFromGit(projectRoot, relpath)
  const dirname = path.dirname(j(projectRoot, relpath))
  return changed({ changedPath: dirname })
}

export async function commitChanges(
  projectRoot: string,
  message: string = "Update"
): Promise<Changed> {
  const author = {}
  const hash = await repo.commitChanges(projectRoot, message)
  return changed({ changedPath: projectRoot })
}

type Action = GitStatusUpdated | Changed

export type RepositoryState = {
  gitRepositoryStatus: GitRepositoryStatus | null
  currentProjectRoot: string
  lastChangedPath: string
  lastChangedGithPath: string
  fsTouchCounter: number
  gitTouchCounter: number
}

const initialState: RepositoryState = {
  gitRepositoryStatus: null,
  currentProjectRoot: "/playground",
  gitTouchCounter: 0,
  lastChangedGithPath: "",
  lastChangedPath: "/playground",
  fsTouchCounter: 0
}

export function reducer(state: RepositoryState = initialState, action: Action) {
  switch (action.type) {
    case CHANGED: {
      return {
        ...state,
        fsTouchCounter: action.payload.file
          ? state.fsTouchCounter + 1
          : state.fsTouchCounter,
        gitTouchCounter: action.payload.git
          ? state.gitTouchCounter + 1
          : state.gitTouchCounter,
        lastChangedPath: action.payload.changedPath
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
