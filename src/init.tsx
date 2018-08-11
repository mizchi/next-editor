// normalize
import "normalize.css/normalize.css"

// blueprint
import "@blueprintjs/core/lib/css/blueprint.css"
import "@blueprintjs/icons/lib/css/blueprint-icons.css"

// contextify
import "react-contexify/dist/ReactContexify.css"

// export fs, git
import fs from "fs"
import * as git from "isomorphic-git"
const g: any = global
g.git = git
g.fs = fs

// Setup react-modal
import Modal from "react-modal"
if (typeof window === "object") {
  const modal = document.createElement("div")
  modal.setAttribute("id", "react-modal")
  document.body.appendChild(modal)
  Modal.setAppElement("#react-modal")
}

// Runner
import React from "react"
import ReactDOM from "react-dom"
import { App } from "./ui/components/App"

export async function run(opts: {} = {}) {
  ReactDOM.render(<App />, document.querySelector(".root"))
}
