import path from "path"
import { RootState } from "."
import { writeFile } from "../../domain/filesystem/commands/writeFile"
import { readFile } from "../../domain/filesystem/queries/readFile"
import { extToFileType } from "../../lib/extToFileType"
import * as Git from "./git"
import * as RepositoryActions from "./repository"

export const CHANGE_VALUE = "editor/change-value"
const LOAD_FILE = "editor/load-file"
const FILE_CHANGED = "editor:file-changed"
const UNLOAD_FILE = "editor/unload-file"

type ChangeValue = {
  type: typeof CHANGE_VALUE
  payload: {
    value: string
  }
}

type FileChanged = {
  type: typeof FILE_CHANGED
  payload: {
    projectRoot: string
    relpath: string
  }
}

type FILE_TYPES = "javascript" | "markdown" | "text"

type LoadFile = {
  type: typeof LOAD_FILE
  payload: {
    filePath: string
    fileType: FILE_TYPES
    value: string
  }
}

type UnloadFile = {
  type: typeof UNLOAD_FILE
}

export type EditorState = {
  filePath: string | null
  fileType: FILE_TYPES
  loading: boolean
  value: string | null
}

export async function loadFile(filePath: string) {
  const fileContent = await readFile(filePath)

  return {
    type: LOAD_FILE,
    payload: {
      filePath,
      fileType: extToFileType(filePath),
      value: fileContent.toString()
    }
  }
}

export async function unloadFile() {
  return {
    type: UNLOAD_FILE
  }
}

export async function fileChanged({ relpath }: { relpath: string }) {
  return async (dispatch: any, getState: () => RootState) => {
    const state = getState()
    dispatch(
      Git.startStagingUpdate(state.repository.currentProjectRoot, [relpath])
    )
  }
}

export async function updateValue(filepath: string, value: string) {
  return async (
    dispatch: (a: Action | RepositoryActions.Action) => void,
    getState: () => RootState
  ) => {
    dispatch({
      type: CHANGE_VALUE,
      payload: {
        value
      }
    })
    await writeFile(filepath, value)

    // update git status
    const state = getState()
    const projectRoot = state.repository.currentProjectRoot
    const relpath = path.relative(projectRoot, filepath)
    dispatch(fileChanged({ relpath }) as any)
  }
}

const initialState: EditorState = {
  filePath: null,
  fileType: "text",
  loading: true,
  value: null
}

export type Action = ChangeValue | LoadFile | UnloadFile

export function reducer(state: EditorState = initialState, action: Action) {
  switch (action.type) {
    case UNLOAD_FILE: {
      return {
        ...state,
        filePath: null,
        fileType: null,
        loading: false,
        value: null
      }
    }
    case LOAD_FILE: {
      return { ...state, ...action.payload, loading: false }
    }
    case CHANGE_VALUE: {
      return { ...state, value: action.payload.value }
    }
    default: {
      return state
    }
  }
}
