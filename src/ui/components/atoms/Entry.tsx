import { Card } from "@blueprintjs/core"
import React from "react"
import pkg from "../../../../package.json"
import { PluginEntryArea } from "./PluginEntryArea"

export class Entry extends React.Component<any> {
  render() {
    return (
      <Card style={{ height: "100%" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <h1>Next Editor v{pkg.version}</h1>
          <p>Editor with Git</p>
          <p>
            This is pre alpha version. There is a possibility you lose data by
            upgrade without notice
          </p>
          <p>
            GitHub:&nbsp;
            <a href="https://github.com/mizchi/next-editor">
              mizchi/next-editor
            </a>
            <br />
            Please report bug or feature requests to{" "}
            <a href="https://github.com/mizchi/next-editor/issues/new">
              GitHub Issue
            </a>{" "}
            or <a href={"https://twitter.com/mizchi"}>@mizchi</a>
          </p>

          <PluginEntryArea />
        </div>
      </Card>
    )
  }
}
