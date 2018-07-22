import { createStore } from "redux"
import { rootReducer } from "../../../reducers"

export function configureTestStore() {
  return createStore(rootReducer as any)
}
