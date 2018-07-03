import React from "react"
import FaClone from "react-icons/fa/clone"
import FaPlus from "react-icons/fa/plus"

export const Help = () => (
  <div style={{ padding: "10px" }}>
    <h1>
      Next Editor by <a href="https://twitter.com/mizchi">@mizchi</a>
    </h1>
    <h2>What's this?</h2>
    <ul>
      <li>PWA: offline ready editor</li>
      <li>Git on browser</li>
      <li>You can push to GitHub</li>
    </ul>
    <h2>How to use</h2>
    <ul>
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
    </p>
  </div>
)
