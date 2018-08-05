/// <reference> ../decls.d.ts
import "normalize.css/normalize.css"

import "@blueprintjs/core/lib/css/blueprint.css"
import "@blueprintjs/icons/lib/css/blueprint-icons.css"

import fs from "fs"
import * as git from "isomorphic-git"
import * as React from "react"
import * as ReactDOM from "react-dom"
import Modal from "react-modal"
import { setupInitialRepository } from "./domain/git/commands/setupInitialRepository"
import { App } from "./ui/components/App"

// export to globals for debug
const g: any = global
g.git = git
g.fs = fs

if (typeof window === "object") {
  const modal = document.createElement("div")
  modal.setAttribute("id", "react-modal")
  document.body.appendChild(modal)
  Modal.setAppElement("#react-modal")
}

;(async () => {
  try {
    await setupInitialRepository("/playground")
  } catch (e) {
    console.log("error")
  }
  ReactDOM.render(<App />, document.querySelector(".root"))
})()
