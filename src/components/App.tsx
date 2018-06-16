import React from "react"
import { Provider } from "react-redux"
import { configureStore } from "../store/configureStore"
import { Editor } from "./pages/Editor"

export const App = () => (
  <Provider store={configureStore()}>
    <Editor />
  </Provider>
)
