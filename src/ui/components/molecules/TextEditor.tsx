import { darken } from "polished"
import React from "react"
import styled from "styled-components"
import { BufferState } from "../../reducers/buffer"
import { GridArea, GridColumn, GridRow } from "../utils/Grid"

type Props = {
  buffer: BufferState
  onChange?: (e: any) => void
  onSave?: (e: any) => void
  onClose: () => void
  onSetAutosave: (value: boolean) => void
}

type State = {
  fontScale: number
  value: string
}

export class TextEditor extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      fontScale: 1.0,
      value: props.buffer.value
    }
  }

  render() {
    const { buffer, onSave, onChange, onSetAutosave } = this.props
    const { value } = this.state
    const { filepath } = buffer
    return (
      <GridRow rows={["30px", "1fr"]} areas={["toolbar", "editor"]}>
        <GridArea name="toolbar">
          <EditorToolbar
            filepath={filepath}
            changed={buffer.changed}
            autosave={buffer.autosave}
            onChangeAutosave={(ev: any) => {
              onSetAutosave(ev.target.checked)
            }}
            onClickSave={() => {
              onSave && onSave(this.state.value)
            }}
            onClickClose={() => {
              this.props.onClose()
            }}
          />
        </GridArea>
        <GridArea name="editor" overflowX="hidden">
          <Textarea
            fontScale={this.state.fontScale}
            spellCheck={false}
            value={value}
            onKeyDown={(ev: KeyboardEvent) => {
              if ((ev.metaKey || ev.ctrlKey) && ev.key === "s") {
                ev.preventDefault()
                onSave && onSave(this.state.value)
              }
            }}
            onChange={(e: any) => {
              this.setState({ value: e.target.value }, () => {
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
  onKeyDown: any
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

export function EditorToolbar({
  filepath,
  changed,
  autosave,
  onClickSave,
  onClickClose,
  onChangeAutosave
}: {
  filepath: string
  changed: boolean
  autosave: boolean
  onClickSave: any
  onClickClose: any
  onChangeAutosave: any
}) {
  return (
    <GridColumn
      columns={["1fr", "240px", "26px"]}
      areas={["filename", "buttons", "close"]}
    >
      <GridArea name="filename">
        <div
          style={{
            fontSize: "0.8em",
            wordWrap: "break-word",
            overflowY: "hidden"
          }}
        >
          {filepath + (changed ? "*" : "")}
        </div>
      </GridArea>
      <GridArea name="buttons">
        | autosave:<input
          type="checkbox"
          defaultChecked={autosave}
          onChange={onChangeAutosave}
        />
        &nbsp;
        {!autosave && (
          <button onClick={onClickSave} disabled={!changed}>
            Save(⌘S)
          </button>
        )}
      </GridArea>
      <GridArea name="close">
        <button onClick={onClickClose}>x</button>
      </GridArea>
    </GridColumn>
  )
}
