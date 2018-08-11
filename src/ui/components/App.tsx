import React from "react"
import { Provider } from "react-redux"
import { PersistGate } from "redux-persist/integration/react"
import { configureStore } from "../store/configureStore"
import { CloneRepoModal } from "./organisms/CloneRepoModal"
import { CreateRepoModal } from "./organisms/CreateRepoModal"
import { Playground } from "./pages/Playground"
import { GlobalErrorBoundary } from "./utils/GlobalErrorBoundary"
import { GlobalKeyHandler } from "./utils/GlobalKeyHandler"
import { Initializer } from "./utils/Initializer"
import { OnlineDetector } from "./utils/OnlineDetector"
import { StackRouter } from "./utils/StackRouter"
import { ThemeProvider } from "./utils/ThemeProvider"

// debug area
const ENTER_PLAYGROUND = false

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
                  {ENTER_PLAYGROUND ? <Playground /> : <StackRouter />}
                  <OnlineDetector />
                  <CreateRepoModal />
                  <CloneRepoModal />
                </Initializer>
              </ThemeProvider>
            </GlobalKeyHandler>
          </PersistGate>
        </Provider>
      </GlobalErrorBoundary>
    )
  }
}
