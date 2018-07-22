import React from "react"
import { lifecycle } from "recompose"
import { connector } from "../../actions"
import { Grid, GridArea } from "../utils/Grid"
import { Editor } from "./Editor"
import { UserSupport } from "./UserSupport"

export const LayoutManager = connector(
  state => {
    return {
      mainLayout: state.app.mainLayout
    }
  },
  actions => {
    return {
      setLayoutMode: actions.app.setLayoutMode
    }
  }
)(props => {
  const { mainLayout, setLayoutMode } = props
  return (
    <>
      <Keydown
        keydown={(e: KeyboardEvent) => {
          // 1
          if (e.ctrlKey && e.keyCode === 49) {
            setLayoutMode({ areas: [["main"]] })
          }
          // 2
          if (e.ctrlKey && e.keyCode === 50) {
            setLayoutMode({ areas: [["main", "support"]] })
          }
        }}
      />
      <Grid
        rows={mainLayout.rows}
        columns={mainLayout.columns}
        areas={mainLayout.areas}
      >
        <GridArea name="main">
          <Editor />
        </GridArea>
        <GridArea name="support">
          <UserSupport />
        </GridArea>
      </Grid>
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
