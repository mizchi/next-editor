import React from "react"
import FaClone from "react-icons/fa/clone"
import FaCog from "react-icons/fa/cog"
import FaPlus from "react-icons/fa/plus"
// import ChangeLog from "../../../../CHANGELOG.md"
import pkg from "../../../../package.json"

export const Help = () => (
  <div
    className="markdown-body"
    style={{
      padding: "10px",
      overflowY: "auto",
      height: "100%",
      boxSizing: "border-box"
    }}
  >
    <h1>Next Editor v{pkg.version}</h1>
    <p>Standalne Editor with Git</p>

    <h2>How to use</h2>
    <ul>
      <li>
        Set your commiter name by <FaCog />
      </li>
      <li>
        Create project by <FaPlus />
      </li>
      <li>
        Clone project from GitHub by <FaClone />
      </li>
    </ul>
    <h2>Keybind</h2>
    <dl>
      <dt>Ctrl + 1</dt>
      <dd>Editor Layout</dd>
      <dt>Ctrl + 2</dt>
      <dd>Editor-Support Layout</dd>
      <dt>Meta + S</dt>
      <dd>Save</dd>
      <dt>Meta + Shift + S</dt>
      <dd>Commit</dd>
    </dl>
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
  </div>
)
