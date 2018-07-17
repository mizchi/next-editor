import React from "react"
import { Help } from "../../atoms/Help"
import { Editor } from "../../molecules/Editor"
import { Column, Fixed, FlexItem, Row } from "../../utils/LayoutUtils"

type Props = {
  filepath: string
  onClickClose: () => void
}

export function FileEditor(props: Props) {
  const { filepath } = props
  return filepath ? (
    <Column>
      <Fixed height={"30px"}>
        <Row>
          <FlexItem width="calc(100% - 30px)" height="100%">
            {filepath}
          </FlexItem>
          <FlexItem>
            <button
              onClick={() => {
                props.onClickClose()
              }}
            >
              x
            </button>
          </FlexItem>
        </Row>
      </Fixed>
      <FlexItem height="calc(100% - 30px)" width="100%">
        <Editor />
      </FlexItem>
    </Column>
  ) : (
    <>
      <Help />
    </>
  )
}
