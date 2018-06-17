import { combineReducers } from "redux"
import { EditorState, reducer as editor } from "./editor"
import { ProjectState, reducer as project } from "./project"
import { reducer as repository, RepositoryState } from "./repository"

export type RootState = {
  repository: RepositoryState
  project: ProjectState
  editor: EditorState
}

export const rootReducer: (
  state: RootState,
  action: any
) => RootState = combineReducers({
  project,
  editor,
  repository
} as any)
