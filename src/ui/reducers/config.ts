import {
  ActionCreator,
  buildActionCreator,
  createReducer,
  Reducer
} from "hard-reducer"

const { createAction } = buildActionCreator({
  prefix: "config/"
})

export type ConfigState = {
  committerName: string
  committerEmail: string
  githubApiToken: string
  githubProxy: string
  theme: string
}

export const setConfigValue: ActionCreator<{
  key: string
  value: string
}> = createAction("set-config-value")

const initalState: ConfigState = {
  committerName: "",
  committerEmail: "",
  githubApiToken: "",
  githubProxy: "https://cors-buster-zashozaqfk.now.sh/github.com/",
  theme: "default"
}

export const reducer: Reducer<ConfigState> = createReducer(initalState).case(
  setConfigValue,
  (state, { key, value }) => {
    return {
      ...state,
      [key]: value
    } as any
  }
)
