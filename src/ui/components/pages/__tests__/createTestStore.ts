import { applyMiddleware, createStore } from "redux"
import { rootReducer } from "../../../reducers"

export const blackhole = (store: any) => (next: any) => (action: any) => {
  // Do nothing just mock
  // next(action);
}

export function configureTestStore() {
  return createStore(rootReducer as any, applyMiddleware(blackhole))
}
