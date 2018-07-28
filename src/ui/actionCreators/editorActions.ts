import { buildActionCreator } from "hard-reducer"
import path from "path"
import { toast } from "react-toastify"
import * as FS from "../../domain/filesystem"
import { writeFile } from "../../domain/filesystem"
import * as Git from "../../domain/git"
import { extToFileType } from "../../lib/extToFileType"
import * as BufferActions from "../reducers/buffer"
import * as GitActions from "../reducers/git"
import * as ProjectActions from "../reducers/project"
import * as RepositoryActions from "../reducers/repository"
import { RootState } from "./../reducers"
import * as GlobalActions from "./globalActions"

// Action
const { createThunkAction } = buildActionCreator({
  prefix: "editor/"
})

// Mutations
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
    await FS.writeFile(filepath, content)
    dispatch(loadFile({ filepath }))
    dispatch(startUpdate({ changedPath: filepath }))
  }
)

export const createDirectory = createThunkAction(
  "create-directory",
  async ({ dirname }: { dirname: string }, dispatch) => {
    await FS.mkdir(dirname)
    dispatch(startUpdate({ changedPath: dirname, isDir: true }))
  }
)

export const deleteFile = createThunkAction(
  "delete-file",
  async ({ filename }: { filename: string }, dispatch) => {
    await FS.unlink(filename)
    dispatch(startUpdate({ changedPath: filename }))
  }
)

export const deleteDirectory = createThunkAction(
  "delete-directory",
  async ({ dirpath }: { dirpath: string }, dispatch) => {
    const files: string[] = await FS.getFilesRecursively(dirpath)
    await FS.removeDirectory(dirpath)
    dispatch(startUpdate({ changedPath: files }))
    // TODO: Update git status
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
    await Git.addFile(projectRoot, relpath)
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
    await Git.removeFromGit(projectRoot, relpath)
    dispatch(startUpdate({ changedPath: path.join(projectRoot, relpath) }))
  }
)

export const deleteProject = createThunkAction(
  "delete-project",
  async ({ dirpath }: { dirpath: string }, dispatch) => {
    await FS.removeDirectory(dirpath)
    dispatch(await ProjectActions.loadProjectList({}))
  }
)

export const finishFileCreating = createThunkAction(
  "finish-file-creating",
  async ({ filepath }: { filepath: string }, dispatch) => {
    await FS.writeFile(filepath, "")
    dispatch(RepositoryActions.endFileCreating({ filepath }))
    dispatch(startUpdate({ changedPath: filepath }))
    dispatch(loadFile({ filepath }))
  }
)

export const finishDirCreating = createThunkAction(
  "finish-dir-creating",
  async ({ dirpath }: { dirpath: string }, dispatch) => {
    await FS.mkdir(dirpath)
    dispatch(RepositoryActions.endDirCreating({ dirpath }))
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
      changedPath?: string | string[]
      isDir?: boolean
    },
    dispatch,
    getState: () => RootState
  ) => {
    dispatch(RepositoryActions.changed({}))
    if (isDir === false && changedPath) {
      const state = getState()
      const projectRoot = state.repository.currentProjectRoot
      const relpaths = (changedPath instanceof Array
        ? changedPath
        : [changedPath]
      )
        .map(p => path.relative(projectRoot, p))
        .filter((r: string) => {
          return !r.startsWith("..")
        })
      if (relpaths.length > 0) {
        dispatch(GitActions.startStagingUpdate(projectRoot, relpaths))
      }
    }
  }
)

export const startProjectRootChanged = createThunkAction(
  "start-project-root-changed",
  async ({ projectRoot }: { projectRoot: string }, dispatch) => {
    dispatch(GlobalActions.projectChanged({ projectRoot }))
    dispatch(await initializeGitStatus(projectRoot))
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
      try {
        await Git.pushBranch(projectRoot, "origin", branch, githubToken)
        toast(`Push success`, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: true,
          pauseOnHover: true,
          draggable: false
        })
        dispatch(startUpdate({}))
      } catch (e) {
        toast(`Push fail: ${e.message}`, {
          type: "error",
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: true,
          pauseOnHover: true,
          draggable: false
        })
      }
    } else {
      console.error("push failed")
    }
  }
}

export async function initializeGitStatus(projectRoot: string) {
  return async (dispatch: any, getState: () => RootState) => {
    dispatch(GlobalActions.projectChanged({ projectRoot }))

    const {
      currentBranch,
      branches,
      remotes,
      remoteBranches
    } = await Git.getBranchStatus(projectRoot)
    const history = await Git.getHistory(projectRoot, { ref: currentBranch })

    dispatch(
      GitActions.endInitialize({
        history,
        remotes,
        currentBranch,
        branches,
        remoteBranches
      })
    )

    const staging = await Git.getStagingStatus(projectRoot, status => {
      const current = getState()
      // stop if root changed
      if (current.repository.currentProjectRoot === projectRoot) {
        dispatch(
          GitActions.progressStagingLoading({
            status
          })
        )
      }
    })

    const lastState = getState()
    if (lastState.repository.currentProjectRoot === projectRoot) {
      dispatch(GitActions.endStagingLoading({ staging }))
    }
  }
}

export async function updateFileContent(
  filepath: string,
  value: string,
  withReload: boolean = false
) {
  return async (dispatch: (a: any) => void, getState: () => RootState) => {
    const state = getState()

    if (state.buffer.autosave) {
      dispatch(BufferActions.saveFile({ value }))
      await writeFile(filepath, value)
    } else {
      dispatch(BufferActions.changeValue({ value }))
    }

    // update git status
    // TODO: Skip git on background
    const projectRoot = state.repository.currentProjectRoot
    const relpath = path.relative(projectRoot, filepath)
    if (!relpath.startsWith("..")) {
      dispatch(
        GitActions.startStagingUpdate(state.repository.currentProjectRoot, [
          relpath
        ])
      )
    }
  }
}

export async function saveFile(
  filepath: string,
  value: string,
  withReload?: boolean
) {
  return async (dispatch: (a: any) => void, getState: () => RootState) => {
    const state = getState()
    await writeFile(filepath, value)
    dispatch(BufferActions.saveFile({ value }))

    if (withReload) {
      dispatch(BufferActions.reload({}))
    }

    // update git status
    // TODO: Skip git on background
    const projectRoot = state.repository.currentProjectRoot
    const relpath = path.relative(projectRoot, filepath)
    if (!relpath.startsWith("..")) {
      dispatch(
        GitActions.startStagingUpdate(state.repository.currentProjectRoot, [
          relpath
        ])
      )
    }
  }
}

export const loadFile = createThunkAction(
  "load-file",
  async ({ filepath }: { filepath: string }, dispatch) => {
    const fileContent = await FS.readFile(filepath)
    dispatch(
      BufferActions.loadFile({
        filepath,
        filetype: extToFileType(filepath),
        value: fileContent.toString()
      })
    )

    // TODO: Correct way to focus to textarea
    setTimeout(() => {
      const el = document.querySelector("textarea")
      if (el) {
        el.focus()
      }
    }, 64)
  }
)

export const moveToBranch = createThunkAction(
  "move-to-branches",
  async (
    input: { projectRoot: string; branch: string },
    dispatch,
    getState: () => RootState
  ) => {
    await Git.checkoutBranch(input.projectRoot, input.branch)

    const state = getState()
    dispatch(
      GitActions.updateBranchStatus({
        currentBranch: input.branch,
        branches: state.git.branches
      })
    )
    dispatch(
      GitActions.updateHistory({
        projectRoot: input.projectRoot,
        branch: input.branch
      })
    )

    if (state.buffer.filepath) {
      // TODO: fix update value
      dispatch(BufferActions.unloadFile({}))
      dispatch(loadFile({ filepath: state.buffer.filepath }))
    }
  }
)
