import { combineReducers } from "redux"
import { AppState, reducer as app } from "./app"
import { EditorState, reducer as editor } from "./editor"
import { ProjectState, reducer as project } from "./project"
import { reducer as repository, RepositoryState } from "./repository"

export type RootState = {
  app: AppState
  repository: RepositoryState
  project: ProjectState
  editor: EditorState
}

export const rootReducer: (
  state: RootState,
  action: any
) => RootState = combineReducers({
  app,
  project,
  editor,
  repository
} as any)
