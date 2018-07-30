import React from "react"
import { Provider } from "react-redux"
import { PersistGate } from "redux-persist/integration/react"
import { configureStore } from "../store/configureStore"
import { GlobalErrorBoundary } from "./utils/GlobalErrorBoundary"
import { GlobalKeyHandler } from "./utils/GlobalKeyHandler"
import { Initializer } from "./utils/Initializer"
import { StackRouter } from "./utils/StackRouter"
import { ThemeProvider } from "./utils/ThemeProvider"

export class App extends React.Component<{}> {
  render() {
    const { store, persistor } = configureStore()
    return (
      <GlobalErrorBoundary>
        <Provider store={store}>
          <PersistGate persistor={persistor}>
            <GlobalKeyHandler>
              <ThemeProvider>
                <Initializer>
                  <StackRouter />
                </Initializer>
              </ThemeProvider>
            </GlobalKeyHandler>
          </PersistGate>
        </Provider>
      </GlobalErrorBoundary>
    )
  }
}
