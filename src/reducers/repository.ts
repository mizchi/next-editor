import path from "path"
import { RootState } from "."
import { mkdir } from "../domain/filesystem/commands/mkdir"
import { removeDirectory } from "../domain/filesystem/commands/removeDirectory"
import { unlink } from "../domain/filesystem/commands/unlink"
import { writeFile } from "../domain/filesystem/commands/writeFile"
import { addFile } from "../domain/git/commands/addFile"
import { checkoutBranch } from "../domain/git/commands/checkoutBranch"
import { commitChanges } from "../domain/git/commands/commitChanges"
import { removeFromGit } from "../domain/git/commands/removeFromGit"
import {
  getProjectGitStatus,
  updateFileStatusInProject
} from "../domain/git/queries/getProjectGitStatus"
import { listBranches } from "../domain/git/queries/listBranches"
import { GitRepositoryStatus } from "../domain/types"
import { GitFileStatus } from "./../domain/types"
import { loadProjectList } from "./project"
import { RepositoryState } from "./repository"

type ThunkAction<A> = (
  dispatch: (a: A) => void | Promise<void>
) => void | Promise<void>

const j = path.join

// Action

const CHANGED = "repository:changed"
const FILE_CHANGED = "repository:file-changed"
const PROJECT_ROOT_CHANGED = "repository:project-root-changed"
const GIT_STATUS_UPDATED_START = "repository:git-status-updated-start"
const GIT_STATUS_UPDATED_END = "repository:git-status-updated-end"
const FILE_CREATING_IN_DIR_START = "repository:file-creating-in-dir-start"
const FILE_CREATING_IN_DIR_CANCEL = "repository:file-creating-in-dir-cancel"
const FILE_CREATING_IN_DIR_END = "repository:file-creating-in-dir-end"
const DIR_CREATING_IN_DIR_START = "repository:dir-creating-in-dir-start"
const DIR_CREATING_IN_DIR_CANCEL = "repository:dir-creating-in-dir-cancel"
const DIR_CREATING_IN_DIR_END = "repository:dir-creating-in-dir-end"

type FileCreatingInDirStart = {
  type: typeof FILE_CREATING_IN_DIR_START
  payload: {
    fileCreatingDir: string
  }
}

type FileCreatingInDirCancel = {
  type: typeof FILE_CREATING_IN_DIR_CANCEL
}

type FileCreatingInDirEnd = {
  type: typeof FILE_CREATING_IN_DIR_END
  payload: {
    filepath: string
  }
}

type DirCreatingInDirStart = {
  type: typeof DIR_CREATING_IN_DIR_START
  payload: {
    dirCreatingDir: string
  }
}

type DirCreatingInDirCancel = {
  type: typeof DIR_CREATING_IN_DIR_CANCEL
}

type DirCreatingInDirEnd = {
  type: typeof DIR_CREATING_IN_DIR_END
  payload: {
    dirpath: string
  }
}

type Changed = {
  type: typeof CHANGED
  payload: {
    git?: boolean
    file?: boolean
    changedPath?: string
  }
}

type FileChanged = {
  type: typeof FILE_CHANGED
  payload: {
    projectRoot: string
    relpath: string
  }
}

type ProjectRootChanged = {
  type: typeof PROJECT_ROOT_CHANGED
  payload: {
    projectRoot: string
    gitStatus: GitRepositoryStatus
  }
}

type GitStatusUpdatedStart = {
  type: typeof GIT_STATUS_UPDATED_START
}

type GitStatusUpdated = {
  type: typeof GIT_STATUS_UPDATED_END
  payload: GitRepositoryStatus
}

export type Action =
  | GitStatusUpdated
  | Changed
  | FileChanged
  | ProjectRootChanged
  | GitStatusUpdatedStart
  | FileCreatingInDirStart
  | FileCreatingInDirCancel
  | FileCreatingInDirEnd
  | DirCreatingInDirStart
  | DirCreatingInDirCancel
  | DirCreatingInDirEnd

// ActionCreator

export function startFileCreating(dirpath: string): FileCreatingInDirStart {
  return {
    type: FILE_CREATING_IN_DIR_START,
    payload: {
      fileCreatingDir: dirpath
    }
  }
}

export function cancelFileCreating(): FileCreatingInDirCancel {
  return {
    type: FILE_CREATING_IN_DIR_CANCEL
  }
}

export function endFileCreating(filepath: string) {
  return async (dispatch: any, getState: () => RootState) => {
    await writeFile(filepath, "")
    dispatch({
      type: FILE_CREATING_IN_DIR_END,
      payload: {
        filepath
      }
    })
    // TODO: Create file
    const state = getState()
    const projectRoot = state.repository.currentProjectRoot
    const relpath = path.resolve(projectRoot, filepath)
    // dispatch(fileChanged({ projectRoot, relpath }))
    dispatch(changed())
  }
}

export function startDirCreating(dirpath: string): DirCreatingInDirStart {
  return {
    type: DIR_CREATING_IN_DIR_START,
    payload: {
      dirCreatingDir: dirpath
    }
  }
}

export function cancelDirCreating(): DirCreatingInDirCancel {
  return {
    type: DIR_CREATING_IN_DIR_CANCEL
  }
}

export function endDirCreating(dirpath: string) {
  return async (dispatch: any, getState: () => RootState) => {
    await mkdir(dirpath)
    dispatch({
      type: DIR_CREATING_IN_DIR_END,
      payload: {
        dirpath
      }
    })
    dispatch(changed())
  }
}

export async function fileChanged({
  relpath,
  projectRoot
}: {
  relpath: string
  projectRoot: string
}) {
  return async (dispatch: any, getState: () => RootState) => {
    const {
      repository: { gitRepositoryStatus }
    } = getState()
    if (gitRepositoryStatus) {
      const gitStatus = await updateFileStatusInProject(
        projectRoot,
        gitRepositoryStatus,
        relpath
      )
      dispatch({
        type: GIT_STATUS_UPDATED_END,
        payload: gitStatus
      })
    }
  }
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

export async function projectRootChanged(projectRoot: string) {
  return async (dispatch: any) => {
    dispatch({
      type: PROJECT_ROOT_CHANGED,
      payload: {
        projectRoot
      }
    })
    dispatch(await updateGitStatus(projectRoot))
  }
}

export async function updateGitStatus(
  projectRoot: string
): Promise<ThunkAction<GitStatusUpdated | GitStatusUpdatedStart>> {
  return async (dispatch: any) => {
    dispatch({ type: GIT_STATUS_UPDATED_START })
    dispatch({
      type: GIT_STATUS_UPDATED_END,
      payload: await getProjectGitStatus(projectRoot)
    })
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

export async function deleteDirectory(dirpath: string) {
  await removeDirectory(dirpath)
  return changed({ changedPath: dirpath })
}

export async function deleteProject(dirpath: string) {
  return async (dispatch: any) => {
    await removeDirectory(dirpath)
    dispatch(await loadProjectList())
  }
}

export async function addToStage(projectRoot: string, relpath: string) {
  await addFile(projectRoot, relpath)
  // return fileChanged({ projectRoot, relpath })
  return changed()
}

export async function removeFileFromGit(projectRoot: string, relpath: string) {
  await removeFromGit(projectRoot, relpath)
  return fileChanged({ projectRoot, relpath })
}

export async function commitStagedChanges(
  projectRoot: string,
  message: string = "Update"
): Promise<Changed> {
  const author = {
    email: localStorage.getItem("committer-email") || "dummy",
    name: localStorage.getItem("committer-name") || "dummy"
  }
  const hash = await commitChanges(projectRoot, message, author)
  return changed({ changedPath: projectRoot })
}

export async function commitUnstagedChanges(
  projectRoot: string,
  unstagedFiles: GitFileStatus[],
  message: string = "Update"
): Promise<Changed> {
  await Promise.all(
    unstagedFiles.map(async file => {
      if (file.status === "*deleted") {
        await removeFromGit(projectRoot, file.relpath)
      } else {
        await addFile(projectRoot, file.relpath)
      }
    })
  )
  const author = {
    email: localStorage.getItem("committer-email") || "dummy",
    name: localStorage.getItem("committer-name") || "dummy"
  }
  const hash = await commitChanges(projectRoot, message, author)
  return changed({ changedPath: projectRoot })
}

export type RepositoryState = {
  fileCreatingDir: string | null
  dirCreatingDir: string | null
  renamingFilepath: string | null
  gitRepositoryStatus: GitRepositoryStatus | null
  gitStatusLoading: boolean
  currentProjectRoot: string
  lastChangedPath: string
  lastChangedGithPath: string
  fsTouchCounter: number
  gitTouchCounter: number
}

const initialState: RepositoryState = {
  fileCreatingDir: null,
  dirCreatingDir: null,
  renamingFilepath: null,
  gitRepositoryStatus: null,
  gitStatusLoading: false,
  currentProjectRoot: "/playground",
  gitTouchCounter: 0,
  lastChangedGithPath: "",
  lastChangedPath: "/playground",
  fsTouchCounter: 0
}

export function reducer(state: RepositoryState = initialState, action: Action) {
  switch (action.type) {
    case PROJECT_ROOT_CHANGED: {
      return {
        ...state,
        currentProjectRoot: action.payload.projectRoot,
        fsTouchCounter: 0,
        gitRepositoryStatus: null,
        gitTouchCounter: 0
      }
    }
    case FILE_CHANGED: {
      const { projectRoot, relpath } = action.payload
      if (state.gitRepositoryStatus != null) {
        return {
          ...state,
          gitRepositoryStatus: updateFileStatusInProject(
            projectRoot,
            state.gitRepositoryStatus,
            relpath
          )
        }
      } else {
        return state
      }
    }
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
    case GIT_STATUS_UPDATED_START: {
      return {
        ...state,
        gitStatusLoading: true
      }
    }
    case GIT_STATUS_UPDATED_END: {
      return {
        ...state,
        gitRepositoryStatus: action.payload,
        gitTouchCounter: state.gitTouchCounter + 1,
        gitStatusLoading: false
      }
    }
    case FILE_CREATING_IN_DIR_START: {
      return {
        ...state,
        fileCreatingDir: action.payload.fileCreatingDir
      }
    }
    case FILE_CREATING_IN_DIR_CANCEL: {
      return {
        ...state,
        fileCreatingDir: null
      }
    }
    case FILE_CREATING_IN_DIR_END: {
      return {
        ...state,
        fileCreatingDir: null
      }
    }
    case DIR_CREATING_IN_DIR_START: {
      return {
        ...state,
        dirCreatingDir: action.payload.dirCreatingDir
      }
    }
    case DIR_CREATING_IN_DIR_CANCEL: {
      return {
        ...state,
        dirCreatingDir: null
      }
    }
    case DIR_CREATING_IN_DIR_END: {
      return {
        ...state,
        dirCreatingDir: null
      }
    }
    default: {
      return state
    }
  }
}
