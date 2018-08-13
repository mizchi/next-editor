// normalize
import "normalize.css/normalize.css"

// global css
import { injectGlobal } from "styled-components"

// tslint:disable-next-line:no-unused-expression
injectGlobal`
select {
  font-family: monospace;
}

textarea:focus,
input:focus select:focus {
  outline: none;
}

::-webkit-scrollbar {
  width: 5px;
}

::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 50, .5);
  border-radius: 0px;
  box-shadow: 0 0 0 1px rgba(255, 255, 255, .3);
}
`

// blueprint
import "@blueprintjs/core/lib/css/blueprint.css"
import "@blueprintjs/icons/lib/css/blueprint-icons.css"

// contextify
import "react-contexify/dist/ReactContexify.css"

// export fs, git
import fs from "fs"
import * as git from "isomorphic-git"

if (process.env.NODE_ENV !== "production") {
  const g: any = global
  g.git = git
  g.fs = fs
}

// Runner
import React from "react"
import ReactDOM from "react-dom"
import { App } from "./ui/components/App"

export async function run(opts: {} = {}) {
  ReactDOM.render(<App />, document.querySelector(".root"))
}
