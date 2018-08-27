import { darken } from "polished"
import React from "react"
import styled from "styled-components"
import { EditorInterface } from "./EditorInterface"

type Props = EditorInterface

export class TextEditor extends React.PureComponent<Props> {
  textareaRef: React.RefObject<any> = React.createRef()
  render() {
    return (
      <Container>
        <StyledTextarea
          fontScale={this.props.fontScale}
          fontFamily={this.props.fontFamily}
          innerRef={this.textareaRef}
          spellCheck={this.props.spellCheck}
          value={this.props.initialValue}
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
  padding: 4px;
  background: ${p => darken(0.05, p.theme.main)};
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);
  box-shadow (rgba(255, 255, 255, .3) -1px 0 0);
  overflow: auto;
`

type StyledTextareaType = {
  fontScale: number
  fontFamily: string
  spellCheck: boolean
  value: string
  onChange: any
  innerRef: any
}

const StyledTextarea: React.ComponentType<StyledTextareaType> = styled.textarea`
  font-family: ${(p: StyledTextareaType) => p.fontFamily};
  font-size: ${(p: StyledTextareaType) => p.fontScale}em;
  -webkit-font-smoothing: antialiased;
  line-height: 1.5em;
  padding: 3px 5px 3px 10px;
  background: ${p => darken(0.02, p.theme.main)};
  color: ${p => p.theme.textColor};
  width: 100%;
  height: 100%;
  resize: none;
  display: block;
  border: 0;
  box-sizing: border-box;

  @media screen and (max-width: 480px) {
    /* max-width: 60vw; */
  }

  /* max-width: 60vw; */
  margin: 0 auto;
  border-left: 1px solid rgba(0, 0, 0, 0.05);
  border-right: 1px solid rgba(0, 0, 0, 0.05);
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);
  box-shadow (rgba(255, 255, 255, .3) -1px 0 0);
`
