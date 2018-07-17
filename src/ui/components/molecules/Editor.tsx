import React from "react"
import { connect } from "react-redux"
import * as EditorActions from "../../actions/editorActions"
import { RootState } from "../../reducers"
import { BufferState } from "../../reducers/buffer"
// import { JavaScriptEditor } from "../atoms/JavaScriptEditor"
import { TextEditor } from "../atoms/TextEditor"

const selector = (state: RootState) => {
  return state.buffer
}

const actions = {
  loadFile: EditorActions.loadFile,
  updateFileContent: EditorActions.updateFileContent
}

type Props = (typeof actions) & BufferState
type State = { value: string }

export const Editor = connect(
  selector,
  actions
)(
  class extends React.Component<Props, State> {
    render() {
      const key = this.props.filepath || "unknown"
      switch (this.props.filetype) {
        // case "javascript": {
        //   return (
        //     <JavaScriptEditor
        //       key={key}
        //       initialValue={this.props.value || ""}
        //       onSave={newValue => {
        //         console.log("on save", newValue)
        //       }}
        //       onChange={async newValue => {
        //         if (this.props.filepath) {
        //           this.props.updateFileContent(this.props.filepath, newValue)
        //         }
        //       }}
        //     />
        //   )
        // }
        case "javascript":
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
                  this.props.updateFileContent(this.props.filepath, newValue)
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
