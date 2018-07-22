import React from "react"
import { connector } from "../../../actionCreators"
import { Help } from "../../atoms/Help"
import { TextEditor } from "../../atoms/TextEditor"

export const Editor = connector(
  state => {
    return {
      buffer: state.buffer
    }
  },
  actions => {
    return {
      unloadFile: actions.buffer.unloadFile,
      loadFile: actions.editor.loadFile,
      updateFileContent: actions.editor.updateFileContent
    }
  }
)(props => {
  const { unloadFile, buffer } = props
  if (buffer.filepath) {
    return (
      <TextEditor
        key={buffer.filepath || "/unknown/"}
        filepath={buffer.filepath as any}
        initialValue={buffer.value || ""}
        onSave={newValue => {
          console.log("on save", newValue)
        }}
        onChange={async newValue => {
          if (buffer.filepath) {
            props.updateFileContent(buffer.filepath, newValue)
          }
        }}
        onClose={() => {
          unloadFile({})
        }}
      />
    )
  } else {
    return <Help />
  }
})
