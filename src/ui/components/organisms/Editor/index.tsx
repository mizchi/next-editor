import path from "path"
import React from "react"
import { formatMarkdown } from "../../../../lib/formatMarkdown"
import { connector } from "../../../actionCreators"
import { Help } from "../../atoms/Help"
import { EditorWithToolbar } from "../../molecules/EditorWithToolbar"

export const Editor = connector(
  state => {
    return {
      projectRoot: state.repository.currentProjectRoot,
      buffer: state.buffer,
      fontScale: state.config.editorFontScale
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
)(function EditorImpl(props) {
  const { unloadFile, buffer, projectRoot, fontScale } = props
  if (buffer.filepath) {
    return (
      <EditorWithToolbar
        projectRoot={projectRoot}
        fontScale={fontScale}
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
        onFormat={() => {
          const ext = path.extname(buffer.filepath)
          switch (ext) {
            case ".md": {
              const formatted = formatMarkdown(buffer.value)
              props.saveFile(buffer.filepath, formatted, true)
            }
          }
        }}
      />
    )
  } else {
    return <Help />
  }
})
