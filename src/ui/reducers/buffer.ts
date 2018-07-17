import {
  ActionCreator,
  buildActionCreator,
  createReducer,
  Reducer
} from "hard-reducer"
import { projectChanged } from "./../actions/globalActions"

const { createAction } = buildActionCreator({
  prefix: "buffer/"
})

export type BufferState = {
  filepath: string | null
  filetype: string | null
  loading: boolean
  value: string | null
}

export const setFileContent: ActionCreator<{
  filepath: string
  filetype: string
  value: string
}> = createAction("set-file-content")

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
  .case(unloadFile, () => {
    return {
      ...initialState,
      loading: false
    }
  })
  .case(setFileContent, (state, payload) => {
    return { ...state, ...payload, loading: false }
  })
  .case(changeValue, (state, payload) => {
    return { ...state, value: payload.value }
  })
