import React from "react"
import { Provider } from "react-redux"
import renderer from "react-test-renderer"
import { Config } from "../Config"
import { Editor } from "../Editor"
import { configureTestStore } from "./createTestStore"

jest.mock("react-toastify", () => {
  return {
    toast: () => "",
    ToastContainer: () => ""
  }
})

// Skip async actions error on componentDidMount
process.on("unhandledRejection", () => {
  /**/
})

test("Editor", () => {
  const store = configureTestStore()
  renderer.create(
    <Provider store={store as any}>
      <Editor />
    </Provider>
  )
})

test("Config", () => {
  const store = configureTestStore()
  renderer.create(
    <Provider store={store as any}>
      <Config />
    </Provider>
  )
})
