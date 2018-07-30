import React from "react"
import { connector } from "../../actionCreators"

// This is example reference
export const _Example = connector(
  _state => {
    return {}
  },
  _actions => {
    return {}
  }
)(function _ExampleImpl(props) {
  const {} = props
  return <div>{/*  */}</div>
})
