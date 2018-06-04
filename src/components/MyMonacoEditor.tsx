import React from "react"
import MonacoEditor from "react-monaco-editor"

type Props = {
  initialValue: string
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

export class MyMonacoEditor extends React.Component<Props, State> {
  constructor(props: any) {
    super(props)
    this.state = {
      value: props.initialValue
    }
  }

  editorDidMount(editor: any, monaco: any) {
    console.log("editorDidMount", editor)
    setupEditor(editor, monaco, () => {
      this.props.onSave(this.state.value)
    })
    editor.focus()
  }

  public onChange(newValue: any, e: Event) {
    this.setState({ value: newValue })
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
        onChange={this.onChange.bind(this)}
        editorDidMount={this.editorDidMount.bind(this)}
      />
    )
  }
}
