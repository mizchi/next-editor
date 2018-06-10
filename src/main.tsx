/// <reference> ./declarations.d.ts
import fs from "fs"
import * as git from "isomorphic-git"
import * as React from "react"
import * as ReactDOM from "react-dom"
import { injectGlobal } from "styled-components"
import { App } from "./components/App"
import { setupInitialRepository } from "./lib/setupInitialRepository"
import "./setupFontAwesome"

// export to globals for debug
const g: any = global
g.__git = git
g.__fs = fs

// tslint:disable-next-line:no-unused-expression
injectGlobal`
html, body {
  overflow: hidden;
  width: 100vw;
  height: 100vh;
  margin: 0;
}

::-webkit-scrollbar {
    width: 5px;
}

::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 50, .5);
  border-radius: 0px;
  box-shadow:0 0 0 1px rgba(255, 255, 255, .3);
}

`
;(async () => {
  try {
    await setupInitialRepository({ dir: "/playground", fs })
  } catch (e) {
    console.log("error")
  }
  console.log("start app")
  ReactDOM.render(<App />, document.querySelector(".root"))
})()
