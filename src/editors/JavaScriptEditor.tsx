import React from "react"
import MonacoEditor from "./MonacoEditor"

type Props = {
  initialValue: string
  onChange: (s: string) => void
  onSave: (s: string) => void
}

type State = {
  value: string
}

const monacoOptions = {
  minimap: { enabled: false }
  // selectOnLineNumbers: true
}

function setupEditor(editor: any, monaco: any, onSaveFunc: () => void) {
  editor.addAction({
    id: "my-save-command",
    label: "My Save Command",
    /* tslint:disable */
    keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_S],
    precondition: null,
    keybindingContext: null,
    contextMenuGroupId: "navigation",
    contextMenuOrder: 1.5,
    run: (newEditor: any) => {
      onSaveFunc()
      return null
    }
  })
  editor.focus()
}

export class JavaScriptEditor extends React.Component<Props, State> {
  constructor(props: any) {
    super(props)
    this.state = {
      value: props.initialValue
    }
  }

  render() {
    const { value } = this.state
    return (
      <MonacoEditor
        width="100%"
        height="100%"
        language="javascript"
        theme="vs-dark"
        value={value}
        options={monacoOptions}
        onChange={(newValue: string, e: Event) => {
          this.setState({ value: newValue })
          this.props.onChange(this.state.value)
        }}
        editorDidMount={(editor: any, monaco: any) => {
          setupEditor(editor, monaco, () => {
            this.props.onSave(this.state.value)
          })
          editor.focus()
        }}
      />
    )
  }
}
