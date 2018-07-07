import { applyMiddleware, createStore } from "redux";
import logger from "redux-logger";
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import promise from "redux-promise";
import thunk from "redux-thunk";
import { rootReducer } from "../reducers";

const persistConfig = {
  key: 'root',
  storage,
}

export function configureStore() {
  const persistedReducer = persistReducer(persistConfig, rootReducer as any)
  const store =  createStore(
    persistedReducer,
    applyMiddleware(thunk, promise, logger)
  )
  const persistor = persistStore(store)
  return { store, persistor }
}
