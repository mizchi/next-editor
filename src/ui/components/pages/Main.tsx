import * as React from "react"
import { Root } from "../atoms/Root"
import { GlobalHeader } from "../organisms/GlobalHeader"
import { LayoutManager } from "../organisms/LayoutManager"
import { Menu } from "../organisms/Menu"
import { Grid, GridArea } from "../utils/Grid"

export function Main() {
  return (
    <Root>
      {/* prettier-ignore */}
      <Grid
        columns={["250px", "1fr"]}
        rows={[
          "30px",
          "1fr"
        ]}
        areas={[
          ["header", "header"],
          ["menu",   "content"]
        ]}
        width="100vw"
        height="100vh"
      >
        <GridArea
          name="header"
        >
          <GlobalHeader />
        </GridArea>
        <GridArea
          name="menu"
        >
          <Menu/>
        </GridArea>
        <GridArea
          name="content"
        >
          <LayoutManager/>
        </GridArea>
      </Grid>
    </Root>
  )
}
