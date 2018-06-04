/// <reference> declarations.d.ts
declare global {
  interface Window {
    fs: any
  }
}

import * as React from "react"
import * as ReactDOM from "react-dom"
import { App } from "./components/App"
import { setupBrowserFS } from "./initializers/setupBrowserFS"

const main = async () => {
  await setupBrowserFS()
  ReactDOM.render(
    <App projectRoot="/react-app" />,
    document.querySelector(".root")
  )
}

main()
