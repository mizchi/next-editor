import { connect } from "react-redux"
import { InferableComponentEnhancerWithProps } from "recompose"
import { combineReducers, compose } from "redux"
import * as app from "./app"
import * as editor from "./editor"
import * as project from "./project"
import * as repository from "./repository"

const allActions = { app, editor, project, repository }

export type RootState = {
  app: app.AppState
  repository: repository.RepositoryState
  project: project.ProjectState
  editor: editor.EditorState
}

export type AllAction = typeof allActions

export const rootReducer: (
  state: RootState,
  action: any
) => RootState = combineReducers({
  app: app.reducer,
  project: project.reducer,
  editor: editor.reducer,
  repository: repository.reducer
} as any)

export const connector = <
  Connected extends {} = {},
  BoundAction extends {} = {},
  OwnProps extends {} = {}
>(
  stateSelector: (state: RootState, ownProps?: OwnProps) => Connected,
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
