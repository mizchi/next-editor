import { Card } from "@blueprintjs/core"
import React from "react"
import FaClone from "react-icons/fa/clone"
import FaCog from "react-icons/fa/cog"
import FaPlus from "react-icons/fa/plus"
// import ChangeLog from "../../../../CHANGELOG.md"
import pkg from "../../../../package.json"

export function Help() {
  return (
    <Card style={{ height: "100%" }}>
      <h1>Next Editor v{pkg.version}</h1>
      <p>Offline standalne editor with git</p>
      <ul>
        <li>
          Set your committer name by <FaCog />
        </li>
        <li>
          Create project by <FaPlus />
        </li>
        <li>
          Clone project from GitHub by <FaClone />
        </li>
      </ul>

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
      <hr />
      <p>
        GitHub:&nbsp;
        <a href="https://github.com/mizchi/next-editor">mizchi/next-editor</a>
        <br />
        Please report bug or feature requests to{" "}
        <a href="https://github.com/mizchi/next-editor/issues/new">
          GitHub Issue
        </a>{" "}
        or <a href={"https://twitter.com/mizchi"}>@mizchi</a>
      </p>
      {/* <hr /> */}
      {/* <ChangeLog /> */}
    </Card>
  )
}
