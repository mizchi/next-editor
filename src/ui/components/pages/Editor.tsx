import * as React from "react"
import { GlobalHeader } from "../molecules/GlobalHeader"
import { EditorContent } from "../organisms/EditorContent"
import { Menu } from "../organisms/Menu"
import { Grid, GridArea, Root } from "../utils/LayoutUtils"

export function Editor() {
  return (
    <Root>
      {/* prettier-ignore */}
      <Grid
        columns={["250px", "1fr"]}
        rows={[
          "40px",
          "1fr"
        ]}
        areas={[
          ["header", "header"],
          ["menu",   "content"],
        ]}
        width="100vw"
        height="100vh"
      >
        <GridArea
          name="header"
          height="40px"
        >
          <GlobalHeader />
        </GridArea>
        <GridArea
          name="menu"
          height="calc(100vh - 40px)"
        >
          <Menu/>
        </GridArea>
        <GridArea
          name="content"
          height="calc(100vh - 40px)"
        >
          <EditorContent/>
        </GridArea>
      </Grid>
    </Root>
  )
}
