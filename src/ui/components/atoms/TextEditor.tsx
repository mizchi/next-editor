import { darken } from "polished"
import React from "react"
import styled from "styled-components"

type Props = {
  fontScale: number
  spellCheck: boolean
  value: string
  onChange: (value: string) => void
}

export const TextEditor = (props: Props) => {
  return (
    <Textarea
      spellCheck={props.spellCheck}
      value={props.value}
      onChange={(ev: any) => {
        props.onChange(ev.target.value)
      }}
    />
  )
}

export const Textarea: React.ComponentType<{
  fontScale?: number
  spellCheck: boolean
  value: string
  onChange: any
}> = styled.textarea`
  font-size: ${p => p.fontScale || "1"}em;
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
