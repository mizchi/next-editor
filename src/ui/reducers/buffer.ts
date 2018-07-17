import {
  ActionCreator,
  buildActionCreator,
  createReducer,
  Reducer
} from "hard-reducer"
import { readFile } from "../../domain/filesystem"
import { extToFileType } from "../../lib/extToFileType"
import { projectChanged } from "./../actions/globalActions"

const { createAction, createAsyncAction } = buildActionCreator({
  prefix: "buffer/"
})

export type BufferState = {
  filepath: string | null
  filetype: string | null
  loading: boolean
  value: string | null
}

export const loadFile = createAsyncAction(
  "load-file",
  async ({ filepath }: { filepath: string }) => {
    const fileContent = await readFile(filepath)
    return {
      filepath,
      filetype: extToFileType(filepath),
      value: fileContent.toString()
    }
  }
)

export const unloadFile: ActionCreator<{}> = createAction("unload-file")

export const changeValue: ActionCreator<{
  value: string
}> = createAction("change-value")

const initialState: BufferState = {
  filepath: null,
  filetype: null,
  loading: true,
  value: null
}

export const reducer: Reducer<BufferState> = createReducer(initialState)
  .case(projectChanged, () => {
    return initialState
  })
  .case(unloadFile, state => {
    return {
      ...state,
      filepath: null,
      filetype: "text",
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
