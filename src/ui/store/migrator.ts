import { rootReducer, RootState } from "../reducers"
import { reducer as configReducer } from "../reducers/config"
import { rules } from "../reducers/config"

const MIGRATOR_INIT = "@migrator/init"

// Reuse prev config value if same key and acceptable instance
function takeOverPrevConfig(prevConfig: any) {
  const nextConfig = configReducer(undefined as any, {
    type: MIGRATOR_INIT
  })

  const newConfig = { ...nextConfig }
  Object.keys(nextConfig).forEach(key => {
    const prevValue = prevConfig[key]
    const rule: { test: (value: any) => boolean } = (rules as any)[key]
    if (rule.test(prevValue)) {
      ;(newConfig as any)[key] = prevValue
    }
  })

  return newConfig
}

export function reuseConfigInState(prevState: RootState) {
  const initialState: RootState = rootReducer(undefined as any, {
    type: MIGRATOR_INIT
  })

  const newConfig = takeOverPrevConfig(prevState.config)
  return {
    ...initialState,
    config: newConfig
  }
}

export const migrationHelper = {
  reuseConfigInState
}

export function buildMigrator(migratorDef: any) {
  const built: any = {}
  Object.keys(migratorDef.migrations).forEach(key => {
    const fns: string[] = migratorDef.migrations[key]
    built[key] = (lastState: any) =>
      fns.reduce((acc: any, nextFnKey: string) => {
        console.log("[migrator:run]", nextFnKey)
        return (migrationHelper as any)[nextFnKey](acc)
      }, lastState)
  })

  return built
}
