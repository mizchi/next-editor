import {
  ActionCreator,
  buildActionCreator,
  createReducer,
  Reducer
} from "hard-reducer"
import path from "path"
import { RootState } from "."
import { mkdir } from "../../domain/filesystem/commands/mkdir"
import { removeDirectory } from "../../domain/filesystem/commands/removeDirectory"
import { unlink } from "../../domain/filesystem/commands/unlink"
import { writeFile } from "../../domain/filesystem/commands/writeFile"
import { addFile } from "../../domain/git/commands/addFile"
import { pushBranch } from "../../domain/git/commands/pushBranch"
import { removeFromGit } from "../../domain/git/commands/removeFromGit"
import * as Git from "./git"
import { loadProjectList } from "./project"
import { RepositoryState } from "./repository"

// State
export type RepositoryState = {
  fileCreatingDir: string | null
  dirCreatingDir: string | null
  renamingFilepath: string | null
  currentProjectRoot: string
  touchCounter: number
}

// Action
const {
  createAsyncAction,
  createAction,
  createThunkAction
} = buildActionCreator({
  prefix: "repository/"
})

const initialState: RepositoryState = {
  fileCreatingDir: null,
  dirCreatingDir: null,
  renamingFilepath: null,
  currentProjectRoot: "/playground",
  touchCounter: 0
}

// ActionCreators

export const startFileCreating: ActionCreator<{
  fileCreatingDir: string
}> = createAction("start-file-creating")

export const cancelFileCreating: ActionCreator<{}> = createAction(
  "cancel-file-creating"
)

const endFileCreating: ActionCreator<{ filepath: string }> = createAction(
  "end-file-creating"
)

export const startDirCreating: ActionCreator<{
  dirCreatingDir: string
}> = createAction("start-dir-creating")

export const cancelDirCreating: ActionCreator<{}> = createAction(
  "cancel-dir-creating"
)

const endDirCreating: ActionCreator<{ dirpath: string }> = createAction(
  "end-dir-creating"
)

export const changed = createAction("changed")

const projectRootChanged: ActionCreator<{
  projectRoot: string
}> = createAction("project-root-changed")

export const createFile = createThunkAction(
  "create-file",
  async (
    {
      filepath,
      content = ""
    }: {
      filepath: string
      content?: string
    },
    dispatch
  ) => {
    await writeFile(filepath, content)
    dispatch(startUpdate({ changedPath: filepath }))
  }
)

export const createDirectory = createThunkAction(
  "create-directory",
  async ({ dirname }: { dirname: string }, dispatch) => {
    await mkdir(dirname)
    dispatch(startUpdate({ changedPath: dirname, isDir: true }))
  }
)

export const deleteFile = createThunkAction(
  "delete-file",
  async ({ filename }: { filename: string }, dispatch) => {
    await unlink(filename)
    dispatch(startUpdate({ changedPath: filename }))
  }
)

export const deleteDirectory = createThunkAction(
  "delete-directory",
  async ({ dirpath }: { dirpath: string }, dispatch) => {
    await removeDirectory(dirpath)
    dispatch(startUpdate({ changedPath: dirpath }))
  }
)

export const addToStage = createThunkAction(
  "add-to-stage",
  async (
    {
      projectRoot,
      relpath
    }: {
      projectRoot: string
      relpath: string
    },
    dispatch
  ) => {
    await addFile(projectRoot, relpath)
    dispatch(startUpdate({ changedPath: path.join(projectRoot, relpath) }))
  }
)

export const removeFileFromGit = createThunkAction(
  "remove-file-from-git",
  async (
    {
      projectRoot,
      relpath
    }: {
      projectRoot: string
      relpath: string
    },
    dispatch
  ) => {
    await removeFromGit(projectRoot, relpath)
    dispatch(startUpdate({ changedPath: path.join(projectRoot, relpath) }))
  }
)

// Thunked: move later
export const deleteProject = createThunkAction(
  "delete-project",
  async ({ dirpath }: { dirpath: string }, dispatch) => {
    await removeDirectory(dirpath)
    dispatch(await loadProjectList({}))
  }
)

export const finishFileCreating = createThunkAction(
  "finish-file-creating",
  async ({ filepath }: { filepath: string }, dispatch) => {
    await writeFile(filepath, "")
    dispatch(endFileCreating({ filepath }))
    dispatch(startUpdate({ changedPath: filepath }))
  }
)

export const finishDirCreating = createThunkAction(
  "finish-dir-creating",
  async ({ dirpath }: { dirpath: string }, dispatch) => {
    await mkdir(dirpath)
    dispatch(endDirCreating({ dirpath }))
    dispatch(startUpdate({ changedPath: dirpath, isDir: true }))
  }
)

export const startUpdate = createThunkAction(
  "start-changed",
  async (
    {
      changedPath,
      isDir = false
    }: {
      changedPath?: string
      isDir?: boolean
    },
    dispatch,
    getState: () => RootState
  ) => {
    dispatch(changed({}))
    if (isDir === false && changedPath) {
      const state = getState()
      const projectRoot = state.repository.currentProjectRoot
      const relpath = path.relative(projectRoot, changedPath)
      if (!relpath.startsWith("..")) {
        dispatch(Git.startStagingUpdate(projectRoot, [relpath]))
      }
    }
  }
)

export const startProjectRootChanged = createThunkAction(
  "start-project-root-changed",
  async ({ projectRoot }: { projectRoot: string }, dispatch) => {
    dispatch(projectRootChanged({ projectRoot }))
    dispatch(await Git.initialize(projectRoot))
  }
)

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
      dispatch(startUpdate({}))
    } else {
      console.error("push failed")
    }
  }
}

export const reducer: Reducer<RepositoryState> = createReducer(initialState)
  .case(projectRootChanged, (state, payload) => {
    return {
      ...state,
      currentProjectRoot: payload.projectRoot,
      touchCounter: 0
    }
  })
  .case(changed, state => {
    console.log("emit changed")
    return {
      ...state,
      touchCounter: state.touchCounter + 1
    }
  })
  .case(startFileCreating, (state, payload) => {
    return {
      ...state,
      fileCreatingDir: payload.fileCreatingDir
    }
  })
  .case(endFileCreating, state => {
    return {
      ...state,
      fileCreatingDir: null
    }
  })
  .case(startDirCreating, (state, payload) => {
    return {
      ...state,
      dirCreatingDir: payload.dirCreatingDir
    }
  })
  .case(endDirCreating, state => {
    return {
      ...state,
      dirCreatingDir: null
    }
  })
