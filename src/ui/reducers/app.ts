const PUSH_SCENE = "app/push-scene"
const POP_SCENE = "app/pop-scene"
const REPLACE_SCENE = "app/replace-scene"
const SET_LAYOUT_MODE = "app/set-layout-mode"

type LayoutMode = "editor" | "preview"

type SetLayoutMode = {
  type: typeof SET_LAYOUT_MODE
  payload: LayoutMode[]
}

type PushScene = {
  type: typeof PUSH_SCENE
  payload: string
}

type PopScene = {
  type: typeof POP_SCENE
}

type ReplaceScene = {
  type: typeof REPLACE_SCENE
  payload: string
}

type Action = PushScene | PopScene | ReplaceScene | SetLayoutMode

export function setLayoutMode(layouts: LayoutMode[]): SetLayoutMode {
  return {
    type: SET_LAYOUT_MODE,
    payload: layouts
  }
}

export function pushScene(nextScene: string): PushScene {
  return {
    type: PUSH_SCENE,
    payload: nextScene
  }
}

export function replaceScene(nextScene: string): ReplaceScene {
  return {
    type: REPLACE_SCENE,
    payload: nextScene
  }
}

export function popScene(): PopScene {
  return {
    type: POP_SCENE
  }
}

export type AppState = {
  sceneStack: string[]
  layouts: LayoutMode[]
}

const initialState: AppState = {
  sceneStack: ["editor"],
  layouts: ["editor", "preview"]
}

export function reducer(state: AppState = initialState, action: Action) {
  switch (action.type) {
    case SET_LAYOUT_MODE: {
      return {
        ...state,
        layouts: action.payload
      }
    }
    case PUSH_SCENE: {
      return { ...state, sceneStack: state.sceneStack.concat([action.payload]) }
    }
    case REPLACE_SCENE: {
      const length = state.sceneStack.length
      const popped = state.sceneStack.slice(0, length - 1)
      return { ...state, sceneStack: popped.concat([action.payload]) }
    }
    case POP_SCENE: {
      const length = state.sceneStack.length
      return { ...state, sceneStack: state.sceneStack.slice(0, length - 1) }
    }
    default: {
      return state
    }
  }
}
