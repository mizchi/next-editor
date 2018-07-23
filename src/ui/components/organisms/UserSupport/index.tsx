import React from "react"
import FaEye from "react-icons/fa/eye"
import FaGit from "react-icons/fa/git"
import { connector } from "../../../actionCreators"
import { BufferState } from "../../../reducers/buffer"
import { MarkdownPreview } from "../../atoms/MarkdownPreview"
import { GridArea, GridRow } from "../../utils/Grid"
import { FileHistory } from "../FileHistory"
import { GitEasy } from "../GitEasy"
import { GitViewer } from "../GitViewer"

type Props = {
  filetype: string
  filepath: string
  value: string
}
type State = {
  mode: "git-easy" | "git" | "preview-by-filetype" | "git-history"
}

export const UserSupport = connector(
  state => {
    return {
      filetype: state.buffer.filetype,
      value: state.buffer.value,
      filepath: state.buffer.filepath
    }
  },
  _actions => ({})
)((props: BufferState) => {
  return (
    <UserSupportContent
      filetype={props.filetype}
      value={props.value}
      filepath={props.filepath}
    />
  )
})

class UserSupportContent extends React.Component<Props, State> {
  state: State = {
    mode: "git-easy"
  }

  render() {
    const { filetype, value } = this.props
    return (
      <GridRow rows={["30px", "1fr"]} areas={["tabs", "content"]}>
        <GridArea name="tabs">
          <div style={{ overflow: "auto" }}>
            <button
              style={{
                background: this.state.mode === "git-easy" ? "#eee" : "#fff",
                outline: "none"
              }}
              disabled={this.state.mode === "git-easy"}
              onClick={() => this.setState({ mode: "git-easy" })}
            >
              <FaGit /> easy
            </button>

            <button
              style={{
                background: this.state.mode === "git" ? "#eee" : "#fff",
                outline: "none"
              }}
              disabled={this.state.mode === "git"}
              onClick={() => this.setState({ mode: "git" })}
            >
              <FaGit />
            </button>

            <button
              style={{
                background: this.state.mode === "git-history" ? "#eee" : "#fff",
                outline: "none"
              }}
              disabled={this.state.mode === "git-history"}
              onClick={() => this.setState({ mode: "git-history" })}
            >
              History
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
        </GridArea>
        <GridArea name="content">
          {/* Content */}
          {this.state.mode === "git-easy" && <GitEasy />}
          {this.state.mode === "git" && <GitViewer />}
          <div>
            {this.state.mode === "git-history" && (
              <FileHistory key={this.props.filepath} />
            )}
          </div>
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
        </GridArea>
      </GridRow>
    )
  }
}
