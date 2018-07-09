import { applyMiddleware, createStore } from "redux"
import logger from "redux-logger"
import { persistReducer, persistStore } from "redux-persist"
import storage from "redux-persist/lib/storage"
import promise from "redux-promise"
import thunk from "redux-thunk"
import pkg from "../../../package.json"
import { rootReducer } from "../reducers"

const persistConfig = {
  key: `root@${pkg.version}`,
  storage
}

const devFlagBySearch =
  typeof window === "object" && window.location.search === "?dev"
const middlewares =
  process.env.NODE_ENV !== "production" || devFlagBySearch
    ? [thunk, promise, logger]
    : [thunk, promise]

export function configureStore() {
  const persistedReducer = persistReducer(persistConfig, rootReducer as any)
  const store = createStore(persistedReducer, applyMiddleware(...middlewares))
  const persistor = persistStore(store)
  return { store, persistor }
}
