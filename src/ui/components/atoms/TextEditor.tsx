import { darken } from "polished"
import React from "react"
import Textarea from "react-textarea-autosize"
import styled from "styled-components"

type Props = {
  fontScale: number
  spellCheck: boolean
  value: string
  onChange: (value: string) => void
}

export class TextEditor extends React.Component<Props> {
  textareaRef: React.RefObject<any> = React.createRef()
  render() {
    return (
      <Container>
        <StyledTextarea
          minRows={6}
          innerRef={this.textareaRef}
          spellCheck={this.props.spellCheck}
          value={this.props.value}
          onChange={(ev: any) => {
            this.props.onChange(ev.target.value)
          }}
        />
      </Container>
    )
  }
}

const Container = styled.div`
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  padding: 5px;
  background: ${p => darken(0.1, p.theme.main)};
  overflow: auto;
`

const StyledTextarea: React.ComponentType<{
  minRows: number
  fontScale?: number
  spellCheck: boolean
  value: string
  onChange: any
  innerRef: any
}> = styled(Textarea)`
  font-size: 1.1em;
  line-height: 1.5em;
  padding: 3px;
  background: ${p => darken(0.05, p.theme.main)};
  color: ${p => p.theme.textColor};
  width: 100%;
  resize: none;
  display: block;
  border: 0;
  box-sizing: border-box;
`
