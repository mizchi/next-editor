import React from "react"
import { Provider } from "react-redux"
import renderer from "react-test-renderer"
import { Config } from "../Config"
import { Main } from "../Main"
import { configureTestStore } from "./createTestStore"

const g: any = global
g.NEPlugins = {}

// Skip async actions error on componentDidMount
process.on("unhandledRejection", () => {
  /**/
})

test("Main", () => {
  const store = configureTestStore()
  renderer.create(
    <Provider store={store as any}>
      <Main />
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
