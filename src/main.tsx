/// <reference> ./declarations.d.ts
import "./styles/react-contextmenu.css"

import fs from "fs"
import * as React from "react"
import * as ReactDOM from "react-dom"
import { injectGlobal } from "styled-components"
import { App } from "./components/App"
import { ensureProjectRepository } from "./lib/repository"

// tslint:disable-next-line:no-unused-expression
injectGlobal`
html, body {
  overflow: hidden;
  width: 100vx;
  height: 100vh;
  margin: 0;
}
`
;(async () => {
  try {
    await ensureProjectRepository({ dir: "/playground", fs })
  } catch (e) {
    console.log("error")
  }
  console.log("start app")
  ReactDOM.render(<App />, document.querySelector(".root"))
})()
