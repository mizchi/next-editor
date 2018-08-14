import { Position, Toaster } from "@blueprintjs/core"
import React from "react"
import { Root } from "../../atoms/Root"

export const AppToaster = Toaster.create({
  position: Position.RIGHT_BOTTOM as any
})

export function Playground() {
  return (
    <Root>
      <App />
    </Root>
  )
}

class App extends React.Component<any> {
  state = {
    component: null
  }
  async componentDidMount() {
    const {
      default: AsyncComponent
    } = await import(/* webpackChunkName: "monaco-editor" */ "../../../../editors/MonacoEditor")
    this.setState({ component: AsyncComponent })
  }
  render() {
    const Cmp: any = this.state.component
    return Cmp == null ? <>loading</> : <Cmp />
  }
}
