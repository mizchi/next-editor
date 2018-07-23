import React from "react"
import { connector } from "../../../actionCreators"
import { Help } from "../../atoms/Help"
import { Editor as EditorContent } from "../../molecules/Editor"

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
      updateFileContent: actions.editor.updateFileContent,
      saveFile: actions.editor.saveFile,
      setAutosave: actions.buffer.setAutosave
    }
  }
)(props => {
  const { unloadFile, buffer } = props
  if (buffer.filepath) {
    return (
      <EditorContent
        key={
          buffer.filepath + ":" + buffer.reloadCounter.toString() || "/unknown/"
        }
        buffer={buffer}
        onSave={newValue => {
          props.saveFile(buffer.filepath, newValue)
        }}
        onChange={async newValue => {
          props.updateFileContent(buffer.filepath, newValue)
        }}
        onClose={() => {
          unloadFile({})
        }}
        onSetAutosave={(value: boolean) => {
          props.setAutosave({ autosave: value })
        }}
      />
    )
  } else {
    return <Help />
  }
})
