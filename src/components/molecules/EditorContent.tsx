import React from "react"
import { connect } from "react-redux"
import { writeFile } from "../../lib/repository"
import { RootState } from "../../reducers"
import * as EditorActions from "../../reducers/editor"
import { EditorState } from "../../reducers/editor"
import { JavaScriptEditor } from "../atoms/JavaScriptEditor"
import { MarkdownEditor } from "../atoms/MarkdownEditor"

const selector = (state: RootState) => {
  return state.editor
}

const actions = {
  loadFile: EditorActions.loadFile,
  updateValue: EditorActions.updateValue
}

type Props = EditorState & {
  loadFile: typeof EditorActions.loadFile
  updateValue: typeof EditorActions.updateValue
}

export const EditorContent = connect(
  selector,
  actions
)((props: Props) => {
  const key = props.filePath || "unknown"
  switch (props.fileType) {
    case "javascript": {
      return (
        <JavaScriptEditor
          key={key}
          initialValue={props.value || ""}
          onSave={newValue => {
            console.log("on save", newValue)
            // this.setState({ editorValue: value })
          }}
          onChange={async newValue => {
            console.log("on change", newValue)
            if (props.filePath) {
              await writeFile(props.filePath, newValue)
              console.log("saved", newValue)
              props.updateValue(newValue)
            }
          }}
        />
      )
    }
    case "markdown": {
      return (
        <MarkdownEditor
          key={key}
          initialValue={props.value || ""}
          onSave={newValue => {
            console.log("on save", newValue)
            // this.setState({ editorValue: value })
          }}
          onChange={async newValue => {
            if (props.filePath) {
              await writeFile(props.filePath, newValue)
              console.log("saved", newValue)
              props.updateValue(newValue)
            }
          }}
        />
      )
    }
    case "text": {
      return (
        <MarkdownEditor
          key={key}
          initialValue={props.value || ""}
          onSave={newValue => {
            console.log("on save", newValue)
            // this.setState({ editorValue: value })
          }}
          onChange={async newValue => {
            if (props.filePath) {
              await writeFile(props.filePath, newValue)
              console.log("saved", newValue)
              // context.updateCurrentFileValue(newValue)
              props.updateValue(newValue)
            }
          }}
        />
      )
    }
    default: {
      return <span>"Loading..."</span>
    }
  }
})
