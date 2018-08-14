import path from "path"
import React from "react"
import { formatMarkdown } from "../../../lib/formatMarkdown"
import { connector } from "../../actionCreators"
import { Entry } from "../atoms/Entry"
import { EditorWithToolbar } from "../molecules/EditorWithToolbar"

export const Editor = connector(
  state => {
    return {
      theme: state.config.theme,
      projectRoot: state.repository.currentProjectRoot,
      buffer: state.buffer,
      fontScale: state.config.editorFontScale,
      fontFamily: state.config.editorFontFamily
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
  const {
    unloadFile,
    buffer,
    projectRoot,
    fontFamily,
    fontScale,
    theme
  } = props
  if (buffer.filepath) {
    return (
      <EditorWithToolbar
        theme={theme}
        projectRoot={projectRoot}
        fontScale={fontScale}
        fontFamily={fontFamily}
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
    return <Entry />
  }
})
