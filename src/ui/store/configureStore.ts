import { applyMiddleware, compose, createStore } from "redux"
import { createMigrate, persistReducer, persistStore } from "redux-persist"
import storage from "redux-persist/lib/storage"
import promise from "redux-promise"
import thunk from "redux-thunk"
import migratorDef from "../../migrator.json"
import { rootReducer } from "../reducers"
import { buildMigrator } from "./migrator"

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

// NOTE: This is last resort for global recovery
const GLOBAL_STATE_VERSION = 0

// presist config
console.log("STATE_VERSION:", migratorDef.version)

const migrator = buildMigrator(migratorDef)

const persistConfig = {
  key: `@:${GLOBAL_STATE_VERSION}`,
  version: migratorDef.version,
  storage,
  migrate: createMigrate(migrator, { debug: true })
}

export function configureStore() {
  const persistedReducer = persistReducer(
    persistConfig as any,
    rootReducer as any
  )
  const store = createStore(persistedReducer, enhancer)
  const persistor = persistStore(store)
  return { store, persistor }
}
