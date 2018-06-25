import React from "react"
import { lifecycle } from "recompose"
import { connector } from "../../../reducers"
import { FlexItem, Row } from "../../utils/LayoutUtils"
import { FileEditor } from "./FileEditor"
import { FilePreview } from "./FilePreview"

export const EditorContent = connector(
  state => {
    return {
      filepath: state.editor.filePath,
      layouts: state.app.layouts
    }
  },
  actions => {
    return {
      setLayoutMode: actions.app.setLayoutMode
    }
  }
)(props => {
  const { filepath, layouts } = props
  const paneWidthPercent = Math.floor(100 / layouts.length)
  return (
    <Row>
      <Keydown
        keydown={(e: KeyboardEvent) => {
          console.log(e.keyCode)
          if (e.ctrlKey && e.keyCode === 49) {
            ;(props as any).setLayoutMode(["editor"])
          }
          if (e.ctrlKey && e.keyCode === 50) {
            ;(props as any).setLayoutMode(["editor", "preview"])
          }
        }}
      />
      <FlexItem width={paneWidthPercent + "%"} height="100%">
        <FileEditor filepath={filepath || ""} />
      </FlexItem>
      <FlexItem width={paneWidthPercent + "%"} height="100%">
        <FilePreview />
      </FlexItem>
    </Row>
  )
})

export const Keydown: React.ComponentType<{
  keydown: any
}> = lifecycle({
  componentDidMount() {
    const self: any = this
    self._keydown = self.props.keydown
    window.addEventListener("keydown", self._keydown)
  },
  componentWillUnmount() {
    const self: any = this
    window.removeEventListener("keydown", self._keydown)
  }
})(_ => [] as any) as any
