import assert from "power-assert"
import { configureStore } from "../configureStore"

test("configureStore", () => {
  const { store } = configureStore()
  const s0 = store.getState()
  store.dispatch({ type: "__nop__" })
  const s1 = store.getState()

  assert.deepEqual(s0, s1)
})
