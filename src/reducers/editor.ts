import { readFile } from "../domain/filesystem/queries/readFile"
import { extToFileType } from "../lib/extToFileType"
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
    payload: {
      filePath,
      fileType: extToFileType(filePath),
      value: fileContent.toString()
    },
    type: LOAD_FILE
  }
}

export async function updateValue(value: string) {
  return {
    payload: {
      value
    },
    type: CHANGE_VALUE
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
