import React from "react"
import { lifecycle } from "recompose"
import { connector } from "../../actions"
import { GridArea, GridColumn } from "../utils/Grid"
import { Editor } from "./Editor"
import { UserSupport } from "./UserSupport"

export const LayoutManager = connector(
  state => {
    return {
      layouts: state.app.layouts
    }
  },
  actions => {
    return {
      setLayoutMode: actions.app.setLayoutMode
    }
  }
)(props => {
  const { layouts, setLayoutMode } = props
  return (
    <>
      <Keydown
        keydown={(e: KeyboardEvent) => {
          // 1
          if (e.ctrlKey && e.keyCode === 49) {
            setLayoutMode(["main"])
          }
          // 2
          if (e.ctrlKey && e.keyCode === 50) {
            setLayoutMode(["main", "preview"])
          }
        }}
      />
      <GridColumn
        columns={["1fr", "1fr"]}
        areas={["left", layouts.length === 2 ? "right" : "left"]}
      >
        <GridArea name="left">
          <Editor />
        </GridArea>
        <GridArea name="right">
          <UserSupport />
        </GridArea>
      </GridColumn>
    </>
  )
})

export const Keydown: React.ComponentType<{
  keydown: any
}> = lifecycle({
  componentDidMount() {
    const self: any = this
    self._keydown = self.props.keydown
    window.addEventListener("keydown", self._keydown)
  },
  componentWillUnmount() {
    const self: any = this
    window.removeEventListener("keydown", self._keydown)
  }
})(_ => [] as any) as any
