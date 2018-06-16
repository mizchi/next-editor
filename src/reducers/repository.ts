import path from "path"
import { mkdir } from "../domain/filesystem/commands/mkdir"
import { unlink } from "../domain/filesystem/commands/unlink"
import { writeFile } from "../domain/filesystem/commands/writeFile"
import { addFile } from "../domain/git/commands/addFile"
import { checkoutBranch } from "../domain/git/commands/checkoutBranch"
import { commitChanges } from "../domain/git/commands/commitChanges"
import { removeFromGit } from "../domain/git/commands/removeFromGit"
import { getProjectGitStatus } from "../domain/git/queries/getProjectGitStatus"
import { listBranches } from "../domain/git/queries/listBranches"
import { GitRepositoryStatus } from "../domain/types"
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
    payload: await getProjectGitStatus(projectRoot)
  }
}

export async function createFile(
  aPath: string,
  content: string = ""
): Promise<Changed> {
  await writeFile(aPath, content)
  const dirname = path.dirname(aPath)
  return changed({ changedPath: dirname })
}

export async function createBranch(projectRoot: string, newBranchName: string) {
  const branches = await listBranches(projectRoot)
  if (!branches.includes(newBranchName)) {
    await createBranch(projectRoot, newBranchName)
    console.log("create branch", newBranchName)
    return changed()
  } else {
    console.error(`Git: Creating branch existed: ${newBranchName}`)
  }
}

export function checkoutToOtherBranch(
  projectRoot: string,
  branchName: string
): ThunkAction<Changed> {
  return async dispatch => {
    const branches = await listBranches(projectRoot)
    if (branches.includes(branchName)) {
      await checkoutBranch(projectRoot, branchName)
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
  await writeFile(aPath, content)
  const dirname = path.dirname(aPath)
  return changed({ changedPath: dirname })
}

export async function createDirectory(aPath: string) {
  await mkdir(aPath)
  const dirname = path.dirname(aPath)
  return changed({ changedPath: dirname })
}

export async function deleteFile(aPath: string) {
  await unlink(aPath)
  const dirname = path.dirname(aPath)
  return changed({ changedPath: dirname })
}

export async function addToStage(
  projectRoot: string,
  relpath: string
): Promise<Changed> {
  await addFile(projectRoot, relpath)
  const dirname = path.dirname(j(projectRoot, relpath))
  return changed({ changedPath: dirname })
}

export async function removeFileFromGit(
  projectRoot: string,
  relpath: string
): Promise<Changed> {
  await removeFromGit(projectRoot, relpath)
  const dirname = path.dirname(j(projectRoot, relpath))
  return changed({ changedPath: dirname })
}

export async function commitStagedChanges(
  projectRoot: string,
  message: string = "Update"
): Promise<Changed> {
  const author = {}
  const hash = await commitChanges(projectRoot, message)
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
