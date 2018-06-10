import path from "path"
import {
  addFileInRepository,
  commitChangesInRepository,
  mkdir,
  unlink,
  writeFile
} from "../lib/repository"

const j = path.join

const PATH_CHANGED = "repository:path-changed"
const GIT_CHANGED = "repository:git-changed"

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

function pathChanged(pathname: string): PathChanged {
  return {
    payload: {
      pathname
    },
    type: PATH_CHANGED
  }
}

function gitChanged(gitRelativePath: string): GitChanged {
  return {
    payload: {
      gitRelativePath
    },
    type: GIT_CHANGED
  }
}

type Action = PathChanged | GitChanged

export type RepositoryState = {
  currentProjectRoot: string
  lastChangedPath: string
  lastChangedGithPath: string
  touchCounter: number
  gitTouchCounter: number
}

const initialState: RepositoryState = {
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
    default: {
      return state
    }
  }
}

export async function createFile(aPath: string, content: string = "") {
  await writeFile(aPath, content)
  const dirname = path.dirname(aPath)
  return pathChanged(dirname)
}

export async function updateFile(aPath: string, content: string) {
  await writeFile(aPath, content)
  const dirname = path.dirname(aPath)
  return pathChanged(dirname)
}

export async function createDirectory(aPath: string) {
  await mkdir(aPath)
  const dirname = path.dirname(aPath)
  return pathChanged(dirname)
}

export async function deleteFile(aPath: string) {
  console.log("deleting...")
  await unlink(aPath)
  const dirname = path.dirname(aPath)
  console.log("deleted")
  return pathChanged(dirname)
}

export async function addToStage(projectRoot: string, relpath: string) {
  await addFileInRepository(projectRoot, relpath)
  const dirname = path.dirname(j(projectRoot, relpath))
  return pathChanged(dirname)
}

export async function commitChanges(
  projectRoot: string,
  message: string = "update"
) {
  const author = {}
  const hash = await commitChangesInRepository(projectRoot, message)
  return pathChanged(projectRoot)
}
