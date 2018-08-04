import assert from "power-assert"
import { rootReducer } from "../../reducers"
import { buildMigrator, reuseConfigInState } from "./../migrator"

const initialState = rootReducer(undefined as any, { type: "init" })

test("reuseConfigInState / reuse same value", () => {
  const prevState = {
    ...initialState,
    config: {
      ...initialState,
      editorSpellCheck: true
    }
  }

  const migrated = reuseConfigInState(prevState as any)
  assert(initialState.config.editorSpellCheck === false)
  assert(migrated.config.editorSpellCheck === true)
})

test("reuseConfigInState / invalidate keys", () => {
  const prevState = {
    ...initialState,
    config: {
      ...initialState,
      editorSpellCheck: "not-boolean",
      unknownKey: "will dissapear"
    }
  }

  const migrated: any = reuseConfigInState(prevState as any)
  assert(initialState.config.editorSpellCheck === false)
  assert(migrated.config.editorSpellCheck === false)
  assert(migrated.config.unknownKey == null)
})

test("buildMigrator", () => {
  const migratorDef = {
    version: 0,
    migrations: {
      0: ["reuseConfigInState"]
    }
  }

  const migrator = buildMigrator(migratorDef)

  const prevState = {
    ...initialState,
    config: {
      ...initialState,
      editorSpellCheck: true
    }
  }

  const migrated: any = migrator["0"](prevState)
  assert(initialState.config.editorSpellCheck === false)
  assert(migrated.config.editorSpellCheck === true)
})
