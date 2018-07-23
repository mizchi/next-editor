import path from "path"
import { darken } from "polished"
import React from "react"
import RichTextEditor from "react-rte"
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
  wysiwyg: boolean
}

export class TextEditor extends React.Component<Props, State> {
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
    return (
      <GridRow rows={["30px", "1fr"]} areas={["toolbar", "editor"]}>
        <GridArea name="toolbar">
          <EditorToolbar
            canUseWysiwyg={path.extname(filepath) === ".md"}
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
            <Textarea
              fontScale={this.state.fontScale}
              spellCheck={false}
              value={value}
              onChange={(e: any) => {
                this.setState({ value: e.target.value }, () => {
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

export function EditorToolbar({
  filepath,
  changed,
  autosave,
  onClickSave,
  onClickClose,
  onChangeAutosave,
  onToggleWysiwyg,
  canUseWysiwyg
}: {
  filepath: string
  changed: boolean
  autosave: boolean
  onClickSave: any
  onClickClose: any
  onChangeAutosave: any
  onToggleWysiwyg: any
  canUseWysiwyg: boolean
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
      </GridArea>
      <GridArea name="close">
        <button onClick={onClickClose}>x</button>
      </GridArea>
    </GridColumn>
  )
}

class WysiwygEditor extends React.Component<
  {
    onChange: any
    initialValue: string
  },
  {
    value: any
  }
> {
  toolbarConfig = {
    // Optionally specify the groups to display (displayed in the order listed).
    display: [
      "INLINE_STYLE_BUTTONS",
      "BLOCK_TYPE_BUTTONS",
      "LINK_BUTTONS",
      "BLOCK_TYPE_DROPDOWN",
      "HISTORY_BUTTONS"
    ],
    INLINE_STYLE_BUTTONS: [
      { label: "Bold", style: "BOLD", className: "custom-css-class" },
      { label: "Italic", style: "ITALIC" },
      { label: "Underline", style: "UNDERLINE" }
    ],
    BLOCK_TYPE_DROPDOWN: [
      { label: "Normal", style: "unstyled" },
      { label: "Heading Large", style: "header-one" },
      { label: "Heading Medium", style: "header-two" },
      { label: "Heading Small", style: "header-three" }
    ],
    BLOCK_TYPE_BUTTONS: [
      { label: "UL", style: "unordered-list-item" },
      { label: "OL", style: "ordered-list-item" }
    ]
  }

  constructor(props: any) {
    super(props)
    this.state = {
      value: RichTextEditor.createValueFromString(
        props.initialValue,
        "markdown"
      )
    }
  }

  render() {
    return (
      <RichTextEditor
        spellCheck={false}
        toolbarConfig={this.toolbarConfig}
        value={this.state.value}
        onChange={(value: any) => {
          this.setState({ value })
          this.props.onChange(value.toString("markdown"))
        }}
        rootStyle={{
          height: "99%"
        }}
      />
    )
  }
}
