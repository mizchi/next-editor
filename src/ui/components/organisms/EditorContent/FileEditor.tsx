import React from "react"
import { Help } from "../../atoms/Help"
import { Editor } from "../../molecules/Editor"
import { GridArea, GridRow } from "../../utils/Grid"

type Props = {
  filepath: string
  onClickClose: () => void
}

export function FileEditor(props: Props) {
  const { filepath } = props
  return filepath ? (
    // prettier-ignore
    <GridRow
      rows={[
        "30px",
        "1fr"
      ]}
      areas={[
        "header",
        "editor"
      ]}
    >
      <GridArea name="header">
        {filepath}
        <button
          onClick={() => {
            props.onClickClose()
          }}
        >
          x
        </button>
      </GridArea>
      <GridArea name="editor" overflowX="hidden">
        <Editor />
      </GridArea>
    </GridRow>
  ) : (
    <>
      <Help />
    </>
  )
}
