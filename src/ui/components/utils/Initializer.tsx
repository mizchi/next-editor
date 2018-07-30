import delay from "delay"
import React from "react"
import lifecycle from "recompose/lifecycle"
import { connector } from "../../actionCreators"
import * as EditorActions from "../../actionCreators/editorActions"
import * as ConfigActions from "../../reducers/config"

type ConnectedProps = {
  isFirstVisit: boolean
  setConfigValue: typeof ConfigActions.setConfigValue
  loadFile: typeof EditorActions.loadFile
  initializeGitStatus: typeof EditorActions.initializeGitStatus
}

export const Initializer = connector(
  state => {
    return {
      isFirstVisit: state.config.isFirstVisit
    }
  },
  actions => {
    return {
      setConfigValue: actions.config.setConfigValue,
      loadFile: actions.editor.loadFile,
      initializeGitStatus: actions.editor.initializeGitStatus
    }
  },
  lifecycle<ConnectedProps, {}>({
    async componentDidMount() {
      // UI Boot
      await delay(150)
      const { isFirstVisit, ...actions } = this.props

      if (isFirstVisit) {
        // Start omotenashi
        // Remove first visit flag
        await actions.setConfigValue({ key: "isFirstVisit", value: false })

        // Open scratch.md as user first view
        actions.loadFile({ filepath: "/playground/scratch.md" })

        // TODO: Reload git on init. Sometimes initialze on git is failing
        actions.initializeGitStatus("/playground")
      }

      // TODO: dirty hack to focus
      // Focus first element
      await delay(150)
      const target = (document as any).querySelector("textarea")
      target && target.focus()
    }
  })
)(function InitializerImpl({ children }) {
  return <>{children}</>
})
