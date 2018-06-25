import React from "react"
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
      <FlexItem width={paneWidthPercent + "%"} height="100%">
        <FileEditor filepath={filepath || ""} />
      </FlexItem>
      <FlexItem width={paneWidthPercent + "%"} height="100%">
        <FilePreview />
      </FlexItem>
    </Row>
  )
})
