import { darken } from "polished"
import React from "react"
import styled from "styled-components"
import { GridArea, GridRow } from "../utils/Grid"

type Props = {
  filepath: string
  initialValue: string
  onChange?: (e: any) => void
  onSave?: (e: any) => void
  onClose: () => void
}

type State = {
  fontScale: number
  value: string
}

export class TextEditor extends React.Component<Props, State> {
  constructor(props: any) {
    super(props)
    this.state = {
      fontScale: 1.0,
      value: props.initialValue
    }
  }

  render() {
    const { filepath } = this.props
    const { value } = this.state
    return (
      <GridRow rows={["30px", "1fr"]} areas={["header", "editor"]}>
        <GridArea name="header">
          {filepath}
          <button onClick={() => this.props.onClose()}>x</button>
        </GridArea>
        <GridArea name="editor" overflowX="hidden">
          <Textarea
            fontScale={this.state.fontScale}
            spellCheck={false}
            value={value}
            onChange={(e: any) => {
              this.setState({ value: e.target.value }, () => {
                const { onChange } = this.props
                onChange && onChange(this.state.value)
              })
            }}
          />
        </GridArea>
      </GridRow>
    )
  }
}

const Textarea: React.ComponentType<{
  fontScale: number
  spellCheck: boolean
  value: string
  onChange: any
}> = styled.textarea`
  font-size: ${p => p.fontScale}em;
  line-height: 1.5em;
  background: ${p => darken(0.05, p.theme.main)};
  color: ${p => p.theme.textColor};
  width: 100%;
  resize: none;
  height: 100%;
  display: block;
  border: 0;
  padding: 4px 4px 0 4px;
  box-sizing: border-box;
`
