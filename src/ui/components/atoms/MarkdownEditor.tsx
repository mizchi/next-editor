import React from "react"
import styled from "styled-components"

type Props = {
  initialValue: string
  onChange?: (e: any) => void
  onSave?: (e: any) => void
}

type State = {
  value: string
}

export class MarkdownEditor extends React.Component<Props, State> {
  constructor(props: any) {
    super(props)
    this.state = {
      value: props.initialValue
    }
  }

  render() {
    const { value } = this.state
    return (
      <Textarea
        spellCheck={false}
        value={value}
        onChange={(e: any) => {
          this.setState({ value: e.target.value }, () => {
            const { onChange } = this.props
            onChange && onChange(this.state.value)
          })
        }}
        onKeyDown={(e: any) => {
          // const { onSave } = this.props
          // onSave && onSave(e.target.value)
        }}
      />
    )
  }
}

const Textarea = styled.textarea`
  font-size: 2em;
  line-height: 1.5em;
  width: 100%;
  height: 100%;
  border: none;
  overflow: auto;
  outline: none;
  box-shadow: none;
  padding: 5px;
  font-size: 1em;
  background-color: #fff;
`
