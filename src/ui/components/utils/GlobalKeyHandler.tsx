import React from "react"
import { HotKeys } from "react-hotkeys"
import { connect } from "react-redux"
import { defaultKeyMap, implCommandMap } from "./commandMap"

export const GlobalKeyHandler = connect(_state => {
  return {}
})(function GlobalKeyHandlerImpl({ children, dispatch }: any) {
  const keyMap = { ...defaultKeyMap }
  const handlers: {
    [key: string]: (dispatch: any, event: any) => void
  } = Object.keys(implCommandMap).reduce(
    (acc, _key: any) => {
      const key: string = _key
      const fn = implCommandMap[key]
      if (fn) {
        return {
          ...acc,
          [key]: (event: Event) => fn(dispatch, event)
        }
      }
      return acc
    },
    {} as any
  )

  return (
    <HotKeys
      focused
      keyMap={keyMap as any}
      handlers={handlers as any}
      style={{ width: "100%", height: "100%" }}
    >
      {children}
    </HotKeys>
  )
})
