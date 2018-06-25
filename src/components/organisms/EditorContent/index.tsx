import React from "react"
import { FlexItem, Padding, Row } from "../../utils/LayoutUtils"
import { FileEditor } from "./FileEditor"
import { FilePreview } from "./FilePreview"

export const EditorContent = () => (
  <Row>
    <FlexItem grow={1} width={"50%"}>
      <Padding value={10}>
        <FileEditor />
      </Padding>
    </FlexItem>
    <FlexItem grow={1} width={"50%"}>
      <Padding value={10}>
        <FilePreview />
      </Padding>
    </FlexItem>
  </Row>
)
