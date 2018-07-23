import path from "path"
import React from "react"
import { BufferState } from "../../reducers/buffer"
import { TextEditor } from "../atoms/TextEditor"
import { WysiwygEditor } from "../atoms/WysiwygEditor"
import { GridArea, GridColumn, GridRow } from "../utils/Grid"

type Props = {
  buffer: BufferState
  onChange?: (e: any) => void
  onSave?: (e: any) => void
  onClose: () => void
  onSetAutosave: (value: boolean) => void
  onFormat: () => void
}

type State = {
  fontScale: number
  value: string
  wysiwyg: boolean
}

export class Editor extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      fontScale: 1.0,
      value: props.buffer.value,
      wysiwyg: false
    }
  }

  render() {
    const { buffer, onSave, onChange, onSetAutosave } = this.props
    const { value } = this.state
    const { filepath } = buffer
    const canUseWysiwyg = path.extname(filepath) === ".md"
    const canFormat = path.extname(filepath) === ".md"
    return (
      <GridRow rows={["30px", "1fr"]} areas={["toolbar", "editor"]}>
        <GridArea name="toolbar">
          <EditorToolbar
            canUseWysiwyg={canUseWysiwyg}
            canFormat={canFormat}
            onToggleWysiwyg={() => {
              this.setState({ wysiwyg: !this.state.wysiwyg })
            }}
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
            onClickFormat={() => {
              this.props.onFormat()
            }}
          />
        </GridArea>
        <GridArea name="editor" overflowX="hidden">
          {this.state.wysiwyg ? (
            <WysiwygEditor
              initialValue={value}
              onChange={(newVal: string) => {
                this.setState({ value: newVal }, () => {
                  onChange && onChange(newVal)
                })
              }}
            />
          ) : (
            <TextEditor
              fontScale={this.state.fontScale}
              spellCheck={false}
              value={value}
              onChange={newValue => {
                this.setState({ value: newValue }, () => {
                  onChange && onChange(this.state.value)
                })
              }}
            />
          )}
        </GridArea>
      </GridRow>
    )
  }
}

export function EditorToolbar({
  filepath,
  changed,
  autosave,
  onClickSave,
  onClickClose,
  onClickFormat,
  onChangeAutosave,
  onToggleWysiwyg,
  canUseWysiwyg,
  canFormat
}: {
  filepath: string
  changed: boolean
  autosave: boolean
  onClickSave: any
  onClickClose: any
  canUseWysiwyg: boolean
  onChangeAutosave: any
  onToggleWysiwyg: any
  onClickFormat: any
  canFormat: boolean
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
        {canUseWysiwyg && <button onClick={onToggleWysiwyg}>W</button>}
        {canFormat && <button onClick={onClickFormat}>F</button>}
      </GridArea>
      <GridArea name="close">
        <button onClick={onClickClose}>x</button>
      </GridArea>
    </GridColumn>
  )
}
