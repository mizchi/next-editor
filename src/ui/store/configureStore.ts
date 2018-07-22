import { applyMiddleware, compose, createStore } from "redux"
import { persistReducer, persistStore } from "redux-persist"
import storage from "redux-persist/lib/storage"
import promise from "redux-promise"
import thunk from "redux-thunk"
import pkg from "../../../package.json"
import { rootReducer } from "../reducers"

const win = window as any

/* redux-dev-tools */
const dev =
  process.env.NODE_ENV !== "production" ||
  (typeof window === "object" && window.location.search === "?dev")

const composeEnhancers =
  typeof win === "object" && win.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? win.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
        // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
      })
    : compose

// with middleware
const enhancer = dev
  ? composeEnhancers(applyMiddleware(thunk, promise))
  : applyMiddleware(thunk, promise)

// presist config
const persistConfig = {
  key: `root@${pkg.version}`,
  storage
}

export function configureStore() {
  const persistedReducer = persistReducer(persistConfig, rootReducer as any)
  const store = createStore(persistedReducer, enhancer)
  const persistor = persistStore(store)
  return { store, persistor }
}
