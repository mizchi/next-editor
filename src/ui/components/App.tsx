import React from "react"
import { Provider } from "react-redux"
import { configureStore } from "../store/configureStore"
import { StackRouter } from "./utils/StackRouter"

export const App = () => (
  <Provider store={configureStore()}>
    <StackRouter />
  </Provider>
)
