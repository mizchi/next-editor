import React from "react"

export const Help = () => (
  <div style={{ padding: "5px" }}>
    <h1>Next Editor</h1>
    <p>
      Developped by <a href="https://twitter.com/mizchi">@mizchi</a>.
    </p>
    <p>
      GitHub: &nbsp;
      <a href="https://github.com/mizchi/next-editor">mizchi/next-editor</a>
    </p>

    <h2>Keybind</h2>
    <ul>
      <li>Ctrl-1: Editor</li>
      <li>Ctrl-2: Editor-Preview</li>
    </ul>

    <h2>Status</h2>
    <p>Pre alpha version. Many features may not work correctly.</p>
    <p>
      My first goal is conceptual implementation. Markup will be postponed after
      that.
    </p>

    <h2>Features</h2>
    <ul>
      <li>Standalone. It works completely offline with service-worker.</li>
      <li>Git integration.</li>
      <li>It can push to GitHub and clone from GitHub. (UI is WIP)</li>
    </ul>
  </div>
)
