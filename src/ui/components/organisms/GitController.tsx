import { Switch } from "@blueprintjs/core"
import React from "react"
import { connector } from "../../actionCreators"
import { GitEasy } from "./GitEasy"
import { GitViewer } from "./GitViewer"

// This is example reference
export const GitController = connector(
  state => {
    return {
      easyMode: state.config.gitEasyMode
    }
  },
  actions => {
    return {
      setConfigValue: actions.config.setConfigValue
    }
  }
)(function GitControllerImpl(props) {
  const { easyMode } = props
  return (
    <div>
      <Switch
        label="Easy Mode"
        checked={easyMode}
        onChange={_event => {
          props.setConfigValue({ key: "gitEasyMode", value: !easyMode })
        }}
      />
      {easyMode ? <GitEasy /> : <GitViewer />}
    </div>
  )
})
