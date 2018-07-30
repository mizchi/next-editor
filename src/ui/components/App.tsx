import React from "react"
import { Provider } from "react-redux"
import { PersistGate } from "redux-persist/integration/react"
import { configureStore } from "../store/configureStore"
import { GlobalKeyHandler } from "./utils/GlobalKeyHandler"
import { Initializer } from "./utils/Initializer"
import { StackRouter } from "./utils/StackRouter"
import { ThemeProvider } from "./utils/ThemeProvider"

export const App = function AppImpl() {
  const { store, persistor } = configureStore()
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <GlobalKeyHandler>
          <ThemeProvider>
            <Initializer>
              <StackRouter />
            </Initializer>
          </ThemeProvider>
        </GlobalKeyHandler>
      </PersistGate>
    </Provider>
  )
}
