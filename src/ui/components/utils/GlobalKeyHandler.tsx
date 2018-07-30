import React from "react"
import { connector } from "../../actionCreators"

export const GlobalKeyHandler = connector(
  _state => {
    return {}
  },
  _actions => {
    return {}
  }
)(function GlobalKeyHandlerImpl({ children }: { children: React.ReactNode }) {
  return <>{children}</>
})
