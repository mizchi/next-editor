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
  | "git"
  | "preview-by-filetype"
  | "git-history"
  | "help"

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

export const changeNetworkStatus: ActionCreator<{
  online: boolean
}> = createAction("change-network-status")

export const openCloneRepoModal: ActionCreator<{}> = createAction(
  "open-clone-repo-modal"
)
export const closeCloneRepoModal: ActionCreator<{}> = createAction(
  "close-clone-repo-modal"
)

export const openCreateRepoModal: ActionCreator<{}> = createAction(
  "open-create-repo-modal"
)

export const closeCreateRepoModal: ActionCreator<{}> = createAction(
  "close-create-repo-modal"
)

export const popScene: ActionCreator<{}> = createAction("pop-scene")

export const setIsMobile: ActionCreator<{ isMobile: boolean }> = createAction(
  "set-is-mobile"
)

export type Layout = {
  areas: AreaName[][]
  columns: string[]
  rows: string[]
}

export type AppState = {
  activeSupport: "git" | "preview-by-filetype" | "git-history" | "help"
  sceneStack: string[]
  mainLayout: Layout
  networkOnline: boolean
  openedCloneRepoModal: boolean
  openedCreateRepoModal: boolean
  isMobile: boolean
}

const initialState: AppState = {
  activeSupport: "git",
  networkOnline: false,
  sceneStack: ["main"],
  openedCloneRepoModal: false,
  openedCreateRepoModal: false,
  mainLayout: {
    columns: ["250px", "1fr", "1fr"],
    rows: ["1fr"],
    areas: [["menu", "editor", "support"]]
  },
  isMobile: false
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
  .case(changeNetworkStatus, (state, payload) => {
    return { ...state, networkOnline: payload.online }
  })
  .case(openCloneRepoModal, state => {
    return { ...state, openedCloneRepoModal: true }
  })
  .case(closeCloneRepoModal, state => {
    return { ...state, openedCloneRepoModal: false }
  })
  .case(openCreateRepoModal, state => {
    return { ...state, openedCreateRepoModal: true }
  })
  .case(closeCreateRepoModal, state => {
    return { ...state, openedCreateRepoModal: false }
  })
  .case(setIsMobile, (state, payload) => {
    return { ...state, isMobile: payload.isMobile }
  })
