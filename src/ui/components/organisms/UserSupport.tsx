import { Button, Card, Tab, Tabs } from "@blueprintjs/core"
import React from "react"
import { connector } from "../../actionCreators"
import { ActiveSupport } from "../../reducers/app"
import { Help } from "../atoms/Help"
import { MarkdownPreview } from "../atoms/MarkdownPreview"
import { TextlintLinter } from "../atoms/TextlintLinter"
import { FileHistory } from "./FileHistory"
import { GitController } from "./GitController"

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
    const { filetype, value, activeSupport, onChangeActiveSupport } = this.props
    return (
      <Card
        style={{
          borderRadius: 0,
          height: "calc(100vh - 32px)",
          overflow: "auto"
        }}
      >
        <Tabs
          id="TabsExample"
          onChange={newTabId => onChangeActiveSupport(newTabId as any)}
          selectedTabId={activeSupport}
          renderActiveTabPanelOnly
          animate={false}
        >
          <Tab id="git" title="Git" panel={<GitController />} />
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
          {filetype === "markdown" && (
            <Tab
              id="publish"
              title="Publish"
              panel={
                <>
                  {Object.values(NEPlugins).map((plugin: any) => {
                    return (
                      plugin.AdditionalSupportComponents &&
                      plugin.AdditionalSupportComponents.map(
                        (Comp: any, index: number) => {
                          return React.createElement(Comp, { key: index })
                        }
                      )
                    )
                  })}
                </>
              }
            />
          )}
          {["text", "markdown"].includes(filetype) && (
            <Tab
              id="linter"
              title="Linter"
              panel={
                <TextlintLinter
                  filename={this.props.filepath}
                  filetype={filetype as any}
                  source={value || ""}
                />
              }
            />
          )}

          <Tab id="help" title="Help" panel={<Help />} />
        </Tabs>
      </Card>
    )
  }
}
