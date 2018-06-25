import React from "react"
import { AllAction, connector, RootState } from "../../../reducers"
import { FlexItem, Padding, Row } from "../../utils/LayoutUtils"
import { FileEditor } from "./FileEditor"
import { FilePreview } from "./FilePreview"

const stateSelector = (state: RootState) => {
  return {
    layoutMode: state.app.layoutMode
  }
}

const actionSelector = (actions: AllAction) => {
  return {
    // app: actions.app
  }
}

export const EditorContent = connector(stateSelector, actionSelector)(props => {
  return (
    <Row>
      <FlexItem width={"50%"}>
        <Padding value={10}>
          <FileEditor />
        </Padding>
      </FlexItem>
      <FlexItem width={"50%"}>
        <Padding value={10}>
          <FilePreview />
        </Padding>
      </FlexItem>
    </Row>
  )
})
