import { applyMiddleware, createStore } from "redux"
import { rootReducer, RootState } from "../../../reducers"

export const blackhole = (store: any) => (next: any) => (action: any) => {
  // Do nothing just mock
  // next(action);
}

export function configureTestStore(
  modifier: ((state: RootState) => RootState) = s => s
) {
  const initialState = rootReducer(undefined as any, { type: "____" })

  return createStore(
    rootReducer as any,
    modifier(initialState) as any,
    applyMiddleware(blackhole)
  )
}
