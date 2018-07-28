import delay from "delay"
import React from "react"
import { Provider } from "react-redux"
import { ToastContainer } from "react-toastify"
import lifecycle from "recompose/lifecycle"
import { PersistGate } from "redux-persist/integration/react"
import * as EditorActions from "../actionCreators/editorActions"
import { RootState } from "../reducers"
import * as ConfigActions from "../reducers/config"
// import { ThemeProvider } from "styled-components"
import { configureStore } from "../store/configureStore"
import { StackRouter } from "./utils/StackRouter"
// import { RootState } from "../reducers"
import { ThemeProvider } from "./utils/ThemeProvider"

let _store: any = null

export const App = lifecycle({
  async componentDidMount() {
    // UI Boot

    if (_store) {
      // TODO: wait few for redux-persist resume and isomorhic-git
      // It's a heuristic value to ensure them.
      await delay(150)

      // Get state after wait. This need redux-persist init.
      const state: RootState = _store.getState()

      if (state.config.isFirstVisit) {
        // Start omotenash

        // Remove first visit flag
        _store.dispatch(
          ConfigActions.setConfigValue({ key: "isFirstVisit", value: false })
        )

        // Open scratch.md as user first view
        _store.dispatch(
          EditorActions.loadFile({ filepath: "/playground/scratch.md" })
        )

        // TODO: Reload git on init. Sometimes initialze on git is failing
        await _store.dispatch(EditorActions.initializeGitStatus("/playground"))
      }
    }

    // TODO: dirty hack to focus

    // Focus first element
    await delay(150)
    const target = (document as any).querySelector("textarea")
    target && target.focus()
  }
})(() => {
  const { store, persistor } = configureStore()
  _store = store
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider>
          <StackRouter />
        </ThemeProvider>
      </PersistGate>
    </Provider>
  )
})
