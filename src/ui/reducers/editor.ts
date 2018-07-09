import {
  ActionCreator,
  buildActionCreator,
  createReducer,
  Reducer
} from "hard-reducer"
import path from "path"
import { RootState } from "."
import { writeFile } from "../../domain/filesystem/commands/writeFile"
import { readFile } from "../../domain/filesystem/queries/readFile"
import { extToFileType } from "../../lib/extToFileType"
import * as Git from "./git"
import * as RepositoryActions from "./repository"

const { createAction, createAsyncAction } = buildActionCreator({
  prefix: "editor/"
})

export type EditorState = {
  filepath: string | null
  fileType: string | null
  loading: boolean
  value: string | null
}

export const loadFile = createAsyncAction(
  "load-file",
  async ({ filepath }: { filepath: string }) => {
    const fileContent = await readFile(filepath)
    return {
      filepath,
      fileType: extToFileType(filepath),
      value: fileContent.toString()
    }
  }
)

export const unloadFile: ActionCreator<{}> = createAction("unload-file")

export async function fileChanged({ relpath }: { relpath: string }) {
  return async (dispatch: any, getState: () => RootState) => {
    const state = getState()
    dispatch(
      Git.startStagingUpdate(state.repository.currentProjectRoot, [relpath])
    )
  }
}

export const changeValue: ActionCreator<{
  value: string
}> = createAction("change-value")

export async function updateValue(filepath: string, value: string) {
  return async (
    dispatch: (a: any | RepositoryActions.Action) => void,
    getState: () => RootState
  ) => {
    dispatch(changeValue({ value }))
    await writeFile(filepath, value)

    // update git status
    const state = getState()
    const projectRoot = state.repository.currentProjectRoot
    const relpath = path.relative(projectRoot, filepath)
    dispatch(fileChanged({ relpath }) as any)
  }
}

const initialState: EditorState = {
  filepath: null,
  fileType: null,
  loading: true,
  value: null
}

export const reducer: Reducer<EditorState> = createReducer(initialState)
  .case(unloadFile, state => {
    return {
      ...state,
      filepath: null,
      fileType: "text",
      loading: false,
      value: null
    }
  })
  .case(loadFile.resolved, (state, payload) => {
    return { ...state, ...payload, loading: false }
  })
  .case(changeValue, (state, payload) => {
    return { ...state, value: payload.value }
  })
