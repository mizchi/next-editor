import path from "path"
import { RootState } from "."
import { writeFile } from "../domain/filesystem/commands/writeFile"
import { readFile } from "../domain/filesystem/queries/readFile"
import { extToFileType } from "../lib/extToFileType"
import * as RepositoryActions from "./repository"
const CHANGE_VALUE = "editor/change-value"
const LOAD_FILE = "editor/load-file"

type ChangeValue = {
  type: typeof CHANGE_VALUE
  payload: {
    value: string
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
    dispatch(RepositoryActions.fileChanged({ projectRoot, relpath }) as any)
  }
}

const initialState: EditorState = {
  filePath: null,
  fileType: "text",
  loading: true,
  value: null
}

export type Action = ChangeValue | LoadFile

export function reducer(state: EditorState = initialState, action: Action) {
  switch (action.type) {
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
