import React from "react"
import { connect } from "react-redux"
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

type Props = (typeof actions) & EditorState
type State = { value: string }

export const EditorContent = connect(
  selector,
  actions
)(
  class extends React.Component<Props, State> {
    render() {
      const key = this.props.filePath || "unknown"
      if (this.props.filePath == null) {
        return <HelpContent />
      }
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
                if (this.props.filePath) {
                  this.props.updateValue(this.props.filePath, newValue)
                }
              }}
            />
          )
        }
        case "markdown": {
          return (
            <MarkdownEditor
              key={key}
              initialValue={this.props.value || ""}
              onSave={newValue => {
                console.log("on save", newValue)
                // this.setState({ editorValue: value })
              }}
              onChange={async newValue => {
                if (this.props.filePath) {
                  this.props.updateValue(this.props.filePath, newValue)
                }
              }}
            />
          )
        }
        case "text": {
          return (
            <MarkdownEditor
              key={key}
              initialValue={this.props.value || ""}
              onSave={newValue => {
                console.log("on save", newValue)
                // this.setState({ editorValue: value })
              }}
              onChange={async newValue => {
                if (this.props.filePath) {
                  this.props.updateValue(this.props.filePath, newValue)
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

// TODO: Move
const HelpContent = () => (
  <div style={{ padding: "5px" }}>
    <h1>Next Editor</h1>
    <p>
      Developped by <a href="https://twitter.com/mizchi">@mizchi</a>.
    </p>
    <p>
      GitHub: &nbsp;
      <a href="https://github.com/mizchi/next-editor">mizchi/next-editor</a>
    </p>

    <h2>Status</h2>
    <p>Pre alpha version. Many features may not work correctly.</p>
    <p>
      My first goal is conceptual implementation. Markup will be postponed after
      that.
    </p>

    <h2>Features</h2>
    <ul>
      <li>Standalone. It works completely offline with service-worker.</li>
      <li>Git integration.</li>
      <li>It can push to GitHub and clone from GitHub. (UI is WIP)</li>
    </ul>
  </div>
)
