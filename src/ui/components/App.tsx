import React from "react"
import { Provider } from "react-redux"
import { ToastContainer } from "react-toastify"
import { PersistGate } from "redux-persist/integration/react"
import { configureStore } from "../store/configureStore"
import { StackRouter } from "./utils/StackRouter"

export const App = () => {
  const { store, persistor } = configureStore()
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <StackRouter />
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          draggablePercent={60}
          closeOnClick
          rtl={false}
          pauseOnVisibilityChange
          draggable
          pauseOnHover
        />
      </PersistGate>
    </Provider>
  )
}
