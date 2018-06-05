/// <reference> ./declarations.d.ts
import * as React from "react"
import * as ReactDOM from "react-dom"
import { injectGlobal } from "styled-components"
import { App } from "./components/App"

// tslint:disable-next-line:no-unused-expression
injectGlobal`
  html, body {
    overflow: hidden;
    width: 100vx;
    height: 100vh;
    margin: 0;
  }
`

ReactDOM.render(<App />, document.querySelector(".root"))
