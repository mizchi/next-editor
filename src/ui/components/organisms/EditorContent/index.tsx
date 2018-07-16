import React from "react"
import { lifecycle } from "recompose"
import { connector } from "../../../reducers"
import { FlexItem, Row } from "../../utils/LayoutUtils"
import { FileEditor } from "./FileEditor"
import { FilePreview } from "./FilePreview"

export const EditorContent = connector(
  state => {
    return {
      filepath: state.buffer.filepath,
      layouts: state.app.layouts
    }
  },
  actions => {
    return {
      setLayoutMode: actions.app.setLayoutMode,
      unloadFile: actions.buffer.unloadFile
    }
  }
)(props => {
  const { filepath, layouts, setLayoutMode, unloadFile } = props
  const paneWidthPercent = Math.floor(100 / layouts.length)
  return (
    <Row height={"100%"}>
      <Keydown
        keydown={(e: KeyboardEvent) => {
          // 1
          if (e.ctrlKey && e.keyCode === 49) {
            setLayoutMode(["editor"])
          }
          // 2
          if (e.ctrlKey && e.keyCode === 50) {
            setLayoutMode(["editor", "preview"])
          }
        }}
      />
      <FlexItem width={paneWidthPercent + "%"} height="100%">
        <FileEditor
          filepath={filepath || ""}
          onClickClose={() => {
            unloadFile({})
          }}
        />
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
