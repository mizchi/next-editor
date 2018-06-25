const PUSH_SCENE = "app/push-scene"
const POP_SCENE = "app/pop-scene"
const REPLACE_SCENE = "app/replace-scene"

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

type Action = PushScene | PopScene | ReplaceScene

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

export function popScene(nextScene: string): PopScene {
  return {
    type: POP_SCENE
  }
}

type LayoutMode = "editor" | "preview"
export type AppState = {
  sceneStack: string[]
  layoutMode: LayoutMode[]
}

const initialState: AppState = {
  sceneStack: ["editor"],
  layoutMode: ["editor", "preview"]
}

export function reducer(state: AppState = initialState, action: Action) {
  switch (action.type) {
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
