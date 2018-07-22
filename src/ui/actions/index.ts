import { connect } from "react-redux"
import { InferableComponentEnhancerWithProps } from "recompose"
import { compose } from "redux"
import { RootState } from "../reducers"
import * as app from "../reducers/app"
import * as buffer from "../reducers/buffer"
import * as config from "../reducers/config"
import * as git from "../reducers/git"
import * as project from "../reducers/project"
import * as repository from "../reducers/repository"
import * as editor from "./editorActions"
import * as _global from "./globalActions"

const allActions = {
  app,
  buffer,
  project,
  repository,
  git,
  config,
  editor,
  global: _global
}

export type AllAction = typeof allActions

export default allActions

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
