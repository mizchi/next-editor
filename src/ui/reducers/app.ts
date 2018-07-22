import {
  ActionCreator,
  buildActionCreator,
  createReducer,
  Reducer
} from "hard-reducer"

const { createAction } = buildActionCreator({
  prefix: "app/"
})

export type AreaName = "editor" | "support"

export const setLayoutAreas: ActionCreator<{
  areas: AreaName[][]
}> = createAction("set-layout-mode")

export const pushScene: ActionCreator<{
  nextScene: string
}> = createAction("push-scene")

export const replaceScene: ActionCreator<{
  nextScene: string
}> = createAction("replace-scene")

export const popScene: ActionCreator<{}> = createAction("pop-scene")

export type Layout = {
  areas: AreaName[][]
  columns: string[]
  rows: string[]
}

export type AppState = {
  sceneStack: string[]
  mainLayout: Layout
}

const initialState: AppState = {
  sceneStack: ["main"],
  mainLayout: {
    columns: ["1fr", "1fr"],
    rows: ["1fr"],
    areas: [["editor", "support"]]
  }
}

export const reducer: Reducer<AppState> = createReducer(initialState)
  .case(setLayoutAreas, (state, payload) => {
    return {
      ...state,
      mainLayout: {
        ...state.mainLayout,
        areas: payload.areas
      }
    }
  })
  .case(pushScene, (state, payload) => {
    return {
      ...state,
      sceneStack: state.sceneStack.concat([payload.nextScene])
    }
  })
  .case(replaceScene, (state, payload) => {
    const length = state.sceneStack.length
    const popped = state.sceneStack.slice(0, length - 1)
    return { ...state, sceneStack: popped.concat([payload.nextScene]) }
  })
  .case(popScene, state => {
    const length = state.sceneStack.length
    return { ...state, sceneStack: state.sceneStack.slice(0, length - 1) }
  })
