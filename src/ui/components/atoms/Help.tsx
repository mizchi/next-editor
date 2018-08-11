import { Card } from "@blueprintjs/core"
import React from "react"
// import ChangeLog from "../../../../CHANGELOG.md"
import pkg from "../../../../package.json"

export class Help extends React.Component<any> {
  render() {
    return (
      <Card style={{ height: "100%" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <h1>Next Editor v{pkg.version}</h1>
          <p>Editor with Git</p>
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

          <table className="bp3-html-table bp3-small .modifier">
            <thead>
              <tr>
                <th>Keymap</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Ctrl + 1</td>
                <td>set-layout-1</td>
              </tr>
              <tr>
                <td>Ctrl + 2</td>
                <td>set-layout-2</td>
              </tr>
              <tr>
                <td>Ctrl + 3</td>
                <td>set-layout-3</td>
              </tr>
              <tr>
                <td>(Cmd / Ctrl) + S</td>
                <td>Save</td>
              </tr>
              <tr>
                <td>(Cmd / Ctrl) + Shift + S</td>
                <td>Commit all</td>
              </tr>
            </tbody>
          </table>
          {/* <hr /> */}
          {/* <hr /> */}
          {/* <ChangeLog /> */}

          {/* Load plugin's EntryPage */}
          {Object.keys(NEPlugins).map(pluginName => {
            const plugin = NEPlugins[pluginName]
            const Entry = plugin.EntryPageComponent
            return Entry ? (
              <Entry key={pluginName} />
            ) : (
              <span key={pluginName}>{pluginName}</span>
            )
          })}
        </div>
      </Card>
    )
  }
}
