import path from "path";
import { RootState } from ".";
import { mkdir } from "../../domain/filesystem/commands/mkdir";
import { removeDirectory } from "../../domain/filesystem/commands/removeDirectory";
import { unlink } from "../../domain/filesystem/commands/unlink";
import { writeFile } from "../../domain/filesystem/commands/writeFile";
import { addFile } from "../../domain/git/commands/addFile";
import { pushBranch } from "../../domain/git/commands/pushBranch";
import { removeFromGit } from "../../domain/git/commands/removeFromGit";
import { GitRepositoryStatus } from "../../domain/types";
import * as Git from "./git";
import { loadProjectList } from "./project";
import { RepositoryState } from "./repository";

// Action
const CHANGED = "repository:changed"
const PROJECT_ROOT_CHANGED = "repository:project-root-changed"
const FILE_CREATING_IN_DIR_START = "repository:file-creating-in-dir-start"
const FILE_CREATING_IN_DIR_CANCEL = "repository:file-creating-in-dir-cancel"
const FILE_CREATING_IN_DIR_END = "repository:file-creating-in-dir-end"
const DIR_CREATING_IN_DIR_START = "repository:dir-creating-in-dir-start"
const DIR_CREATING_IN_DIR_CANCEL = "repository:dir-creating-in-dir-cancel"
const DIR_CREATING_IN_DIR_END = "repository:dir-creating-in-dir-end"

// State
export type RepositoryState = {
  fileCreatingDir: string | null
  dirCreatingDir: string | null
  renamingFilepath: string | null
  currentProjectRoot: string
  lastChanges: Change[]
  touchCounter: number
}

const initialState: RepositoryState = {
  fileCreatingDir: null,
  dirCreatingDir: null,
  renamingFilepath: null,
  currentProjectRoot: "/playground",
  lastChanges: [],
  touchCounter: 0
}

// actions
type ThunkAction<A> = (
  dispatch: (a: A) => void | Promise<void>,
  getState: () => RootState
) => void | Promise<void>

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
    changes: Change[]
  }
}

type ProjectRootChanged = {
  type: typeof PROJECT_ROOT_CHANGED
  payload: {
    projectRoot: string
    gitStatus: GitRepositoryStatus
  }
}

export type Action =
  | Changed
  | ProjectRootChanged
  | FileCreatingInDirStart
  | FileCreatingInDirCancel
  | FileCreatingInDirEnd
  | DirCreatingInDirStart
  | DirCreatingInDirCancel
  | DirCreatingInDirEnd

// ActionCreators
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
  return async (dispatch: any, _getState: () => RootState) => {
    await writeFile(filepath, "")
    dispatch({
      type: FILE_CREATING_IN_DIR_END,
      payload: {
        filepath
      }
    })
    dispatch(changed({ changedPath: filepath }))
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
    dispatch(changed({ changedPath: dirpath, isDir: true }))
  }
}

export function changed({
  changedPath,
  isDir = false
}: {
  changedPath?: string
  isDir?: boolean
} = {}): ThunkAction<any> {
  return (dispatch, getState) => {
    dispatch({
      type: CHANGED,
      payload: {
        changes: changedPath ? [createLastChange(changedPath, isDir)] : []
      }
    })
    if (isDir === false && changedPath) {
      const state = getState()
      const projectRoot = state.repository.currentProjectRoot
      const relpath = path.relative(projectRoot, changedPath)
      if (!relpath.startsWith("..")) {
        dispatch(Git.startStagingUpdate(projectRoot, [relpath]))
      }
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
    dispatch(await Git.initialize(projectRoot))
  }
}

export async function createFile(
  filepath: string,
  content: string = ""
): Promise<any> {
  await writeFile(filepath, content)
  return changed({ changedPath: filepath })
}

export async function pushCurrentBranchToOrigin(
  projectRoot: string,
  branch: string
) {
  return async (dispatch: any, getState: () => RootState) => {
    const state = getState()
    const githubToken = state.config.githubApiToken
    if (githubToken.length > 0) {
      await pushBranch(projectRoot, "origin", branch, githubToken)
      console.log("push succeeded")
      dispatch(changed())
    } else {
      console.error("push failed")
    }
  }
}

export async function createDirectory(dirname: string) {
  await mkdir(dirname)
  return changed({ changedPath: dirname, isDir: true })
}

export async function deleteFile(filename: string) {
  await unlink(filename)
  return changed({ changedPath: filename })
}

export async function deleteDirectory(dirpath: string) {
  await removeDirectory(dirpath)
  return changed({ changedPath: dirpath })
}

export async function deleteProject(dirpath: string) {
  return async (dispatch: any) => {
    await removeDirectory(dirpath)
    dispatch(await loadProjectList({}))
  }
}

export async function addToStage(projectRoot: string, relpath: string) {
  await addFile(projectRoot, relpath)
  return changed({ changedPath: path.join(projectRoot, relpath) })
}

export async function removeFileFromGit(projectRoot: string, relpath: string) {
  await removeFromGit(projectRoot, relpath)
  return changed({ changedPath: path.join(projectRoot, relpath) })
}

export function reducer(
  state: RepositoryState = initialState,
  action: Action
): RepositoryState {
  switch (action.type) {
    case PROJECT_ROOT_CHANGED: {
      return {
        ...state,
        currentProjectRoot: action.payload.projectRoot,
        touchCounter: 0
      }
    }
    case CHANGED: {
      return {
        ...state,
        touchCounter: state.touchCounter + 1,
        lastChanges: action.payload.changes
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

// ---
type Change = {
  dirname: string
  filepath: string | null
}

function createLastChange(filepath: string, isDir: boolean = false): Change {
  return {
    filepath: isDir ? null : filepath,
    dirname: isDir ? filepath : path.dirname(filepath)
  }
}
