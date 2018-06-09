import React from "react"
import { Provider } from "react-redux"
import { configureStore } from "../store/configureStore"
import { RepositoryEdit } from "./organisms/RepositoryEdit"

export const App = () => (
  <Provider store={configureStore()}>
    <RepositoryEdit />
  </Provider>
)
