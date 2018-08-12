import { configure, mount } from "enzyme"
import Adapter from "enzyme-adapter-react-16"
import React from "react"
import { Provider } from "react-redux"
import { CloneRepoModal } from "../CloneRepoModal"
import { CreateRepoModal } from "../CreateRepoModal"
import { configureTestStore } from "./createTestStore"

import { _Example } from "../_Example"
import { RepositoryMenu, ViewMenu } from "../GlobalHeader"

configure({ adapter: new Adapter() })

test("_Example", () => {
  const store = configureTestStore(s => {
    return s
  })
  mount(
    <Provider store={store}>
      <_Example />
    </Provider>
  )
})

test("CreateRepoModal", () => {
  const store = configureTestStore(s => {
    return {
      ...s,
      app: {
        ...s.app,
        openedCreateRepoModal: true
      }
    }
  })
  mount(
    <Provider store={store}>
      <CreateRepoModal />
    </Provider>
  )
})

test("CloneRepoModal", () => {
  const store = configureTestStore(s => {
    return {
      ...s,
      app: {
        ...s.app,
        openedCloneRepoModal: true
      }
    }
  })
  mount(
    <Provider store={store}>
      <CloneRepoModal />
    </Provider>
  )
})

test("RepositoryMenu", () => {
  const store = configureTestStore(s => s)
  mount(
    <Provider store={store}>
      <RepositoryMenu />
    </Provider>
  )
})

test("ViewMenu", () => {
  const store = configureTestStore(s => s)
  mount(
    <Provider store={store}>
      <ViewMenu />
    </Provider>
  )
})
