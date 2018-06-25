import React from "react"
import { Help } from "../../atoms/Help"
import { Editor } from "../../molecules/Editor"
import { Column, Fixed, FlexItem } from "../../utils/LayoutUtils"

type Props = {
  filepath: string
}

export function FileEditor(props: Props) {
  const { filepath } = props
  return filepath ? (
    <Column>
      <Fixed height={"30px"}>{filepath}</Fixed>
      <FlexItem height="calc(100% - 30px)" width="100%">
        <Editor />
      </FlexItem>
    </Column>
  ) : (
    <Help />
  )
}
