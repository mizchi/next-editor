import {
  ActionCreator,
  buildActionCreator,
  createReducer,
  Reducer
} from "hard-reducer"
import { projectChanged } from "../actions/globalActions"
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
const { createAction } = buildActionCreator({
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

export const endFileCreating: ActionCreator<{
  filepath: string
}> = createAction("end-file-creating")

export const startDirCreating: ActionCreator<{
  dirCreatingDir: string
}> = createAction("start-dir-creating")

export const cancelDirCreating: ActionCreator<{}> = createAction(
  "cancel-dir-creating"
)

export const endDirCreating: ActionCreator<{ dirpath: string }> = createAction(
  "end-dir-creating"
)

export const changed = createAction("changed")

export const reducer: Reducer<RepositoryState> = createReducer(initialState)
  .case(projectChanged, (state, payload) => {
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
