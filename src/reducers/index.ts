import { combineReducers } from "redux"
import { reducer as repository, State as Repository } from "./repository"

export type RootState = {
  repository: Repository
}

export const rootReducer = combineReducers({
  repository
})
