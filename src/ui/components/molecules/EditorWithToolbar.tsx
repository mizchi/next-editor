import { ButtonGroup, Switch } from "@blueprintjs/core"
import path from "path"
import React from "react"
import { TextEditor } from "../../../editors/TextEditor"
import { BufferState } from "../../reducers/buffer"
import { GridArea, GridColumn, GridRow } from "../utils/Grid"

type Props = {
  projectRoot: string
  buffer: BufferState
  fontScale: number
  fontFamily: string
  onChange?: (e: any) => void
  onSave?: (e: any) => void
  onClose: () => void
  onSetAutosave: (value: boolean) => void
  onFormat: () => void
}

type State = {
  value: string
  editorComponent: React.ComponentType<any> | null
  editorType: "text" | "wysiwyg" | "monaco"
}

// Cache loaded editor components
const cache: { [key: string]: any } = {}

export class EditorWithToolbar extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    const editorType =
      path.extname(props.buffer.filepath) === ".js" ? "monaco" : "text"

    this.state = {
      value: props.buffer.value,
      editorComponent: null,
      editorType
    }
  }

  componentDidMount() {
    this._loadEditorComponent(this.state.editorType)
  }

  async componentDidUpdate(_: any, oldState: State) {
    if (this.state.editorType !== oldState.editorType) {
      this._loadEditorComponent(this.state.editorType)
    }
  }

  async _loadEditorComponent(editorType: "monaco" | "text" | "wysiwyg") {
    switch (editorType) {
      case "text": {
        this.setState({ editorComponent: TextEditor })
        break
      }
      case "wysiwyg": {
        if (cache.wysiwyg) {
          this.setState({ editorComponent: cache.wysiwyg })
          break
        }
        console.time("load:wysiwyg")
        const {
          WysiwygEditor
        } = await import(/* webpackChunkName: "wysiwyg" */ "../../../editors/WysiwygEditor")
        this.setState({ editorComponent: WysiwygEditor })
        cache.wysiwyg = WysiwygEditor
        console.timeEnd("load:wysiwyg")
        break
      }
      case "monaco": {
        if (cache.monaco) {
          this.setState({ editorComponent: cache.monaco })
          break
        }
        console.time("load:monaco")
        const {
          JavaScriptEditor
        } = await import(/* webpackChunkName: "monaco" */ "../../../editors/JavaScriptEditor")
        this.setState({ editorComponent: JavaScriptEditor })
        cache.monaco = JavaScriptEditor
        console.timeEnd("load:monaco")
        break
      }
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
    const Editor = this.state.editorComponent
    return (
      <GridRow rows={["30px", "1fr"]} areas={["toolbar", "editor"]}>
        <GridArea name="toolbar">
          <EditorToolbar
            editorType={this.state.editorType}
            displayFilepath={displayFilepath}
            canUseWysiwyg={canUseWysiwyg}
            canFormat={canFormat}
            changed={buffer.changed}
            autosave={buffer.autosave}
            onChangeEditor={(editorType: "text" | "wysiwyg" | "monaco") => {
              this.setState({ editorType })
            }}
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
          {Editor ? (
            <Editor
              // key={this.state.editorType}
              fontFamily={this.props.fontFamily}
              fontScale={this.props.fontScale}
              spellCheck={false}
              initialValue={value}
              onChange={(newValue: string) => {
                this.setState({ value: newValue }, () => {
                  onChange && onChange(this.state.value)
                })
              }}
            />
          ) : (
            <>Loading...</>
          )}
        </GridArea>
      </GridRow>
    )
  }
}

export function EditorToolbar({
  editorType,
  displayFilepath,
  changed,
  autosave,
  onClickSave,
  onClickClose,
  onClickFormat,
  onChangeAutosave,
  canUseWysiwyg,
  canFormat,
  onChangeEditor
}: {
  editorType: string
  displayFilepath: string
  changed: boolean
  autosave: boolean
  onClickSave: any
  onClickClose: any
  canUseWysiwyg: boolean
  onChangeAutosave: any
  onClickFormat: any
  onChangeEditor: (editorType: "text" | "wysiwyg" | "monaco") => void
  canFormat: boolean
}) {
  const editorTypes = ["text", "monaco"]
  if (canUseWysiwyg) {
    editorTypes.push("wysiwyg")
  }
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
          <select
            className="bp3-select"
            value={editorType}
            onChange={ev => onChangeEditor(ev.target.value as any)}
          >
            {editorTypes.map(type => {
              return (
                <option value={type} key={type}>
                  {type}
                </option>
              )
            })}
          </select>
        </ButtonGroup>
        {!autosave && (
          <button onClick={onClickSave} disabled={!changed}>
            Save(⌘S)
          </button>
        )}
        {canFormat && <button onClick={onClickFormat}>F</button>}
      </GridArea>
      <GridArea name="close">
        <button onClick={onClickClose}>x</button>
      </GridArea>
    </GridColumn>
  )
}
