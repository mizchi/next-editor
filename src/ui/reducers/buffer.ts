import {
  ActionCreator,
  buildActionCreator,
  createReducer,
  Reducer
} from "hard-reducer"
import { projectChanged } from "./../actionCreators/globalActions"

const { createAction } = buildActionCreator({
  prefix: "buffer/"
})

export type BufferState = {
  autosave: boolean
  filepath: string
  filetype: "text" | "markdown"
  changed: boolean
  value: string
  lastSavedValue: string
  reloadCounter: number
}

export const setAutosave: ActionCreator<{
  autosave: boolean
}> = createAction("set-autosave")

export const loadFile: ActionCreator<{
  filepath: string
  filetype: string
  value: string
}> = createAction("load-content")

export const saveFile: ActionCreator<{
  value?: string
}> = createAction("save-file")

export const reload: ActionCreator<{}> = createAction("reload")

export const unloadFile: ActionCreator<{}> = createAction("unload-file")

export const changeValue: ActionCreator<{
  value: string
}> = createAction("change-value")

const initialState: BufferState = {
  autosave: true,
  filepath: "",
  filetype: "text",
  changed: false,
  value: "",
  lastSavedValue: "",
  reloadCounter: 0
}

export const reducer: Reducer<BufferState> = createReducer(initialState)
  .case(projectChanged, () => {
    return initialState
  })
  .case(unloadFile, () => {
    return {
      ...initialState,
      changed: false
    }
  })
  .case(loadFile, (state, payload) => {
    return {
      ...state,
      filepath: payload.filepath,
      filetype: payload.filetype as any,
      value: payload.value,
      lastSavedValue: payload.value,
      changed: false,
      reloadCounter: 0
    }
  })
  .case(saveFile, (state, payload) => {
    const nextValue = payload.value || state.value
    return {
      ...state,
      value: nextValue,
      lastSavedValue: nextValue,
      changed: false
    }
  })
  .case(setAutosave, (state, payload) => {
    return {
      ...state,
      autosave: payload.autosave
    }
  })
  .case(reload, (state, payload) => {
    return {
      ...state,
      reloadCounter: state.reloadCounter + 1
    }
  })
  .case(changeValue, (state, payload) => {
    if (state.autosave) {
      return {
        ...state,
        value: payload.value,
        lastSavedValue: payload.value,
        changed: false
      }
    } else {
      return {
        ...state,
        value: payload.value,
        changed: state.lastSavedValue !== payload.value
      }
    }
  })
