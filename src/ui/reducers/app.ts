import {
  ActionCreator,
  buildActionCreator,
  createReducer,
  Reducer
} from "hard-reducer"

const { createAction } = buildActionCreator({
  prefix: "app/"
})

export type AreaName = "menu" | "editor" | "support"
export type ActiveSupport =
  | "git-easy"
  | "git"
  | "preview-by-filetype"
  | "git-history"

export const setActiveSupport: ActionCreator<{
  support: ActiveSupport
}> = createAction("set-layout-mode")

export const setLayout1 = createAction(
  "set-layout-1",
  (_input: {}): Layout => {
    return {
      columns: ["250px", "1fr", "1fr"],
      rows: ["1fr"],
      areas: [["menu", "editor", "support"]]
    }
  }
)

export const setLayout2 = createAction(
  "set-layout-2",
  (_input: {}): Layout => {
    return {
      columns: ["250px", "1fr"],
      rows: ["1fr"],
      areas: [["menu", "editor"]]
    }
  }
)

export const setLayout3 = createAction(
  "set-layout-3",
  (_input: {}): Layout => {
    return {
      columns: ["1fr"],
      rows: ["1fr"],
      areas: [["editor"]]
    }
  }
)

export const setLayout4 = createAction(
  "set-layout-4",
  (_input: {}): Layout => {
    return {
      columns: ["1fr", "1fr"],
      rows: ["1fr"],
      areas: [["editor", "support"]]
    }
  }
)

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
  activeSupport: "git-easy" | "git" | "preview-by-filetype" | "git-history"
  sceneStack: string[]
  mainLayout: Layout
}

const initialState: AppState = {
  activeSupport: "git-easy",
  sceneStack: ["main"],
  mainLayout: {
    columns: ["250px", "1fr", "1fr"],
    rows: ["1fr"],
    areas: [["menu", "editor", "support"]]
  }
}

export const reducer: Reducer<AppState> = createReducer(initialState)
  .case(setLayout1, (state, payload) => {
    return {
      ...state,
      mainLayout: payload
    }
  })
  .case(setLayout2, (state, payload) => {
    return {
      ...state,
      mainLayout: payload
    }
  })
  .case(setLayout3, (state, payload) => {
    return {
      ...state,
      mainLayout: payload
    }
  })
  .case(setLayout4, (state, payload) => {
    return {
      ...state,
      mainLayout: payload
    }
  })
  .case(setActiveSupport, (state, payload) => {
    return {
      ...state,
      activeSupport: payload.support
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
