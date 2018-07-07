import React from "react"
import FaClone from "react-icons/fa/clone"
import FaCog from "react-icons/fa/cog"
import FaPlus from "react-icons/fa/plus"
import pkg from "../../../../package.json"

export const Help = () => (
  <div className="markdown-body" style={{ padding: "10px" }}>
    <h1>Next Editor v{pkg.version}</h1>
    <h2>What's this?</h2>
    <ul>
      <li>PWA: offline ready editor for Chromebook</li>
      <li>Git on browser</li>
      <li>You can push to GitHub</li>
    </ul>
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
      <li>Press Ctrl-1: Editor mode</li>
      <li>Press Ctrl-2: Editor-Preview mode</li>
    </ul>
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
  </div>
)
