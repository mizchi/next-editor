import { Card, Tab, Tabs } from "@blueprintjs/core"
import React from "react"
import { connector } from "../../../actionCreators"
import { BufferState } from "../../../reducers/buffer"
import { MarkdownPreview } from "../../atoms/MarkdownPreview"
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
    // TODO: Move this into reducer
    mode: "git-easy"
  }

  render() {
    // FIX: Work arround for https://github.com/palantir/blueprint/pull/2761
    if (process.env.NODE_ENV === "test") {
      return <div>FIX ME</div>
    }
    const { filetype, value } = this.props
    const { mode } = this.state
    return (
      <Card style={{ borderRadius: 0, height: "100%" }}>
        <Tabs
          id="TabsExample"
          onChange={newTabId => this.setState({ mode: newTabId as any })}
          selectedTabId={mode}
          renderActiveTabPanelOnly
        >
          <Tab id="git-easy" title="Git Easy" panel={<GitEasy />} />
          <Tab id="git" title="Git" panel={<GitViewer />} />
          <Tab
            id="history"
            title="History"
            panel={<FileHistory key={this.props.filepath} />}
          />
          {filetype === "markdown" && (
            <Tab
              id="preview-by-filetype"
              title="Preview"
              panel={<MarkdownPreview source={value || ""} />}
            />
          )}
        </Tabs>
      </Card>
    )
  }
}
