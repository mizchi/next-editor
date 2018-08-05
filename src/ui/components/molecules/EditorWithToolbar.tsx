import { Button, ButtonGroup, Switch } from "@blueprintjs/core"
import path from "path"
import React from "react"
import { TextEditor } from "../../../editors/TextEditor"
import { WysiwygEditor } from "../../../editors/WysiwygEditor"
import { BufferState } from "../../reducers/buffer"
import { GridArea, GridColumn, GridRow } from "../utils/Grid"

type Props = {
  projectRoot: string
  buffer: BufferState
  onChange?: (e: any) => void
  onSave?: (e: any) => void
  onClose: () => void
  onSetAutosave: (value: boolean) => void
  onFormat: () => void
  fontScale: number
}

type State = {
  value: string
  wysiwyg: boolean
}

export class EditorWithToolbar extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      value: props.buffer.value,
      wysiwyg: false
    }
  }

  render() {
    const { buffer, projectRoot, onSave, onChange, onSetAutosave } = this.props
    const { value } = this.state
    const { filepath } = buffer
    const canUseWysiwyg = path.extname(filepath) === ".md"
    const canFormat = path.extname(filepath) === ".md"
    const relpath = filepath.replace(projectRoot + "/", "")
    const displayFilepath = relpath
    const basename = path.basename(relpath)
    return (
      <GridRow rows={["30px", "1fr"]} areas={["toolbar", "editor"]}>
        <GridArea name="toolbar">
          <EditorToolbar
            displayFilepath={displayFilepath}
            canUseWysiwyg={canUseWysiwyg}
            canFormat={canFormat}
            onToggleWysiwyg={() => {
              this.setState({ wysiwyg: !this.state.wysiwyg })
            }}
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
              fontScale={this.props.fontScale}
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
  displayFilepath,
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
  displayFilepath: string
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
            textOverflow: "ellipsis",
            paddingLeft: 6,
            paddingTop: 6,
            overflow: "hidden",
            whiteSpace: "nowrap",
            width: "100%"
          }}
        >
          {displayFilepath + (changed ? "*" : "")}
        </div>
      </GridArea>
      <GridArea name="buttons">
        <ButtonGroup>
          <Switch
            alignIndicator="right"
            label="autosave"
            checked={autosave}
            onChange={onChangeAutosave}
          />
        </ButtonGroup>
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
