import React from "react"
import { EditorInterface } from "./EditorInterface"
import MonacoEditor from "./MonacoEditor"

type Props = EditorInterface

type State = {
  value: string
}

const monacoOptions = {
  minimap: { enabled: false }
}

export class ProgramEditor extends React.Component<Props, State> {
  constructor(props: any) {
    super(props)
    this.state = {
      value: props.initialValue
    }
  }

  render() {
    const { fontScale, onChange, theme } = this.props
    const { language, ...options } = this.props.options || {
      language: "javascript"
    }
    const { value } = this.state

    return (
      <MonacoEditor
        width="100%"
        height="100%"
        language={language || "javascript"}
        value={value}
        options={{
          ...monacoOptions,
          fontSize: fontScale * 12,
          theme: theme === "dark" ? "vs-dark" : null,
          tabSize: 2,
          insertSpaces: true,
          ...options
        }}
        onChange={(newValue: string, e: Event) => {
          this.setState({ value: newValue })
          onChange(this.state.value)
        }}
        editorDidMount={(editor: any, _monaco: any) => {
          editor.focus()
        }}
      />
    )
  }
}
