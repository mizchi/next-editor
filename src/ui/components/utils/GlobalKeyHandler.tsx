import React from "react"
import { HotKeys } from "react-hotkeys"
import { connect } from "react-redux"
import { defaultKeyMap, ImplCommandList, implCommandMap } from "./commandMap"

type Props = { children: React.ReactNode; dispatch: any }

export const GlobalKeyHandler = connect(_state => {
  return {}
})(function GlobalKeyHandlerImpl({ children, dispatch }: Props) {
  const keyMap = { ...defaultKeyMap }
  const handlers: {
    [key in ImplCommandList]: (dispatch: any, event: any) => void
  } = Object.keys(ImplCommandList).reduce(
    (acc, _key: any) => {
      const key: ImplCommandList = _key
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
