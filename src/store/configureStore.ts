import { applyMiddleware, createStore } from "redux"
import logger from "redux-logger"
import promise from "redux-promise"
import thunk from "redux-thunk"
import { rootReducer } from "../reducers"

export function configureStore() {
  return createStore(
    rootReducer as any,
    applyMiddleware(thunk, promise, logger)
  )
}
