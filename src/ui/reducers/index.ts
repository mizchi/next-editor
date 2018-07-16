import { connect } from "react-redux"
import { InferableComponentEnhancerWithProps } from "recompose"
import { combineReducers, compose } from "redux"
import allActions from "../actions"
import * as app from "./app"
import * as buffer from "./buffer"
import * as config from "./config"
import * as git from "./git"
import * as project from "./project"
import * as repository from "./repository"

export type RootState = {
  app: app.AppState
  repository: repository.RepositoryState
  project: project.ProjectState
  buffer: buffer.BufferState
  git: git.GitState
  config: config.ConfigState
}

export type AllAction = typeof allActions

export const rootReducer: (
  state: RootState,
  action: any
) => RootState = combineReducers({
  app: app.reducer,
  project: project.reducer,
  buffer: buffer.reducer,
  repository: repository.reducer,
  git: git.reducer,
  config: config.reducer
} as any)

export const connector = <
  OwnProps extends {} = {},
  Connected extends {} = {},
  BoundAction extends {} = {}
>(
  stateSelector: (state: RootState, ownProps: OwnProps) => Connected,
  actionSelector: (actions: AllAction) => BoundAction,
  // ...hocs: Array<(props: Connected & BoundAction) => any>
  ...hocs: any[]
): InferableComponentEnhancerWithProps<Connected & BoundAction, OwnProps> => {
  return (compose as any)(
    connect(
      stateSelector,
      actionSelector(allActions)
    ),
    ...hocs
  )
}
