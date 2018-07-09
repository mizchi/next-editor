import React from "react"
import FaEye from "react-icons/fa/eye"
import FaGit from "react-icons/fa/git"
import { connector, RootState } from "../../../reducers"
import { EditorState } from "../../../reducers/editor"
import { MarkdownPreview } from "../../atoms/MarkdownPreview"
import { GitViewer } from "../GitViewer"

const selector = (state: RootState) => state.editor

type Props = {
  fileType: string | null
  value: string
}
type State = {
  mode: "git-browser" | "preview-by-filetype"
}

class PreviewSwitcher extends React.Component<Props, State> {
  state: State = {
    mode: "git-browser"
  }

  render() {
    const { fileType, value } = this.props
    return (
      <div
        style={{
          background: "#eee",
          width: "100%",
          height: "100%",
          overflowY: "scroll",
          overflowX: "hidden"
        }}
      >
        <div style={{ overflow: "auto" }}>
          <button
            style={{
              background: this.state.mode === "git-browser" ? "#eee" : "#fff",
              outline: "none"
            }}
            disabled={this.state.mode === "git-browser"}
            onClick={() => this.setState({ mode: "git-browser" })}
          >
            <FaGit />
          </button>
          {fileType === "markdown" && (
            <button
              style={{
                background:
                  this.state.mode === "preview-by-filetype" ? "#eee" : "#fff",
                outline: "none"
              }}
              disabled={this.state.mode === "preview-by-filetype"}
              onClick={() => this.setState({ mode: "preview-by-filetype" })}
            >
              <FaEye />
            </button>
          )}
        </div>
        {/* Content */}
        <div>{this.state.mode === "git-browser" && <GitViewer />}</div>
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

export const FilePreview = connector(selector, actions => ({}))(
  (props: EditorState) => {
    return (
      <PreviewSwitcher fileType={props.fileType} value={props.value || ""} />
    )
  }
)
