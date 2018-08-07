import { Card, Tab, Tabs } from "@blueprintjs/core"
import React from "react"
import { connector } from "../../../actionCreators"
import { ActiveSupport } from "../../../reducers/app"
import { MarkdownPreview } from "../../atoms/MarkdownPreview"
import { FileHistory } from "../FileHistory"
import { GitEasy } from "../GitEasy"
import { GitViewer } from "../GitViewer"

export const UserSupport = connector(
  state => {
    return {
      filetype: state.buffer.filetype,
      value: state.buffer.value,
      filepath: state.buffer.filepath,
      activeSupport: state.app.activeSupport
    }
  },
  actions => ({
    setActiveSupport: actions.app.setActiveSupport
  })
)(function UserSupportImpl(props) {
  return (
    <UserSupportContent
      activeSupport={props.activeSupport}
      filetype={props.filetype}
      value={props.value}
      filepath={props.filepath}
      onChangeActiveSupport={activeSupport => {
        props.setActiveSupport({ support: activeSupport })
      }}
    />
  )
})

type Props = {
  activeSupport: ActiveSupport
  filetype: string
  filepath: string
  value: string
  onChangeActiveSupport: (support: ActiveSupport) => void
}

class UserSupportContent extends React.PureComponent<Props> {
  render() {
    // FIX: Work arround for https://github.com/palantir/blueprint/pull/2761
    if (process.env.NODE_ENV === "test") {
      return <div>FIX ME</div>
    }
    const { filetype, value, activeSupport, onChangeActiveSupport } = this.props
    return (
      <Card style={{ borderRadius: 0, height: "100%" }}>
        <Tabs
          id="TabsExample"
          onChange={newTabId => onChangeActiveSupport(newTabId as any)}
          selectedTabId={activeSupport}
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
