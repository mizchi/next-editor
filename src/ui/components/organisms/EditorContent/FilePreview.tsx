import React from "react"
import { connect } from "react-redux"
import { RootState } from "../../../reducers"
import { EditorState } from "../../../reducers/editor"
// import { BabelCodePreview } from "../../atoms/BabelCodePreview"
import { MarkdownPreview } from "../../atoms/MarkdownPreview"
import { GitStatusViewer } from "../GitStatusViewer"

const selector = (state: RootState) => state.editor

type Props = {
  fileType: string
  value: string
}
type State = {
  mode: "git-browser" | "preview-by-filetype"
}

class Tab extends React.Component<{ tabs: string[] }> {
  render() {
    return (
      <div>
        <div>Tabs</div>
        <div>Contents</div>
      </div>
    )
  }
}

class PreviewSwitcher extends React.Component<Props, State> {
  state: State = {
    mode: "git-browser"
  }

  render() {
    const { fileType, value } = this.props
    return (
      <div>
        <div>
          {this.state.mode === "git-browser" ? (
            "Git"
          ) : (
            <button onClick={() => this.setState({ mode: "git-browser" })}>
              Git
            </button>
          )}
          {this.state.mode === "preview-by-filetype" ? (
            "Preview"
          ) : (
            <button
              onClick={() => this.setState({ mode: "preview-by-filetype" })}
            >
              Preview
            </button>
          )}
        </div>
        <div>{this.state.mode === "git-browser" && <GitStatusViewer />}</div>
        <div>
          {this.state.mode === "preview-by-filetype" && (
            <>
              filetype: <span>{fileType}</span>
              {(() => {
                switch (fileType) {
                  // case "javascript": {
                  //   return <BabelCodePreview source={value || ""} />
                  // }
                  case "markdown": {
                    return <MarkdownPreview source={value || ""} />
                  }
                  case "text": {
                    return <pre>{value || ""}</pre>
                  }
                  default: {
                    return ""
                  }
                }
              })()}
            </>
          )}
        </div>
      </div>
    )
  }
}

export const FilePreview = connect(selector)((props: EditorState) => {
  return <PreviewSwitcher fileType={props.fileType} value={props.value || ""} />
})
