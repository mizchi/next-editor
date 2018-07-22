import React from "react"
import FaEye from "react-icons/fa/eye"
import FaGit from "react-icons/fa/git"
import { connector } from "../../../actions"
import { BufferState } from "../../../reducers/buffer"
import { MarkdownPreview } from "../../atoms/MarkdownPreview"
import { GitViewer } from "../GitViewer"

type Props = {
  filetype: string | null
  value: string
}
type State = {
  mode: "git-browser" | "preview-by-filetype"
}

export const UserSupport = connector(
  state => {
    return state.buffer
  },
  _actions => ({})
)((props: BufferState) => {
  return (
    <UserSupportContent filetype={props.filetype} value={props.value || ""} />
  )
})

class UserSupportContent extends React.Component<Props, State> {
  state: State = {
    mode: "git-browser"
  }

  render() {
    const { filetype, value } = this.props
    return (
      <div
        style={{
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
          {filetype === "markdown" && (
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
              filetype: <span>{filetype}</span>
              {(() => {
                switch (filetype) {
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
