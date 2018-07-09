import React from "react"
import { connect } from "react-redux"
import { RootState } from "../../reducers"
import * as EditorActions from "../../reducers/editor"
import { EditorState } from "../../reducers/editor"
import { JavaScriptEditor } from "../atoms/JavaScriptEditor"
import { TextEditor } from "../atoms/TextEditor"

const selector = (state: RootState) => {
  return state.editor
}

const actions = {
  loadFile: EditorActions.loadFile,
  updateValue: EditorActions.updateValue
}

type Props = (typeof actions) & EditorState
type State = { value: string }

export const Editor = connect(
  selector,
  actions
)(
  class extends React.Component<Props, State> {
    render() {
      const key = this.props.filepath || "unknown"
      switch (this.props.fileType) {
        case "javascript": {
          return (
            <JavaScriptEditor
              key={key}
              initialValue={this.props.value || ""}
              onSave={newValue => {
                console.log("on save", newValue)
              }}
              onChange={async newValue => {
                if (this.props.filepath) {
                  this.props.updateValue(this.props.filepath, newValue)
                }
              }}
            />
          )
        }
        case "markdown":
        case "text": {
          return (
            <TextEditor
              key={key}
              initialValue={this.props.value || ""}
              onSave={newValue => {
                console.log("on save", newValue)
              }}
              onChange={async newValue => {
                if (this.props.filepath) {
                  this.props.updateValue(this.props.filepath, newValue)
                }
              }}
            />
          )
        }
        default: {
          return <span>"Loading..."</span>
        }
      }
    }
  }
)
