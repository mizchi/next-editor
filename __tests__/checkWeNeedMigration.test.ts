import { rootReducer } from "../src/ui/reducers"

// This is special test for migration checker
test("Check we need migration", () => {
  const initialState = rootReducer(undefined as any, { type: "init" })
  expect(initialState).toMatchSnapshot()
})
