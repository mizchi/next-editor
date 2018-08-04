import * as React from "react"
import { Root } from "../atoms/Root"
import { GlobalHeader } from "../organisms/GlobalHeader"
import { LayoutManager } from "../organisms/LayoutManager"
import { Menu } from "../organisms/Menu"
import { Grid, GridArea } from "../utils/Grid"

export function Main() {
  return (
    <Root data-testid="main">
      {/* prettier-ignore */}
      <Grid
        columns={["1fr"]}
        rows={[
          "32px",
          "1fr"
        ]}
        areas={[
          ["header"],
          ["content"]
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
          name="content"
        >
          <LayoutManager/>
        </GridArea>
      </Grid>
    </Root>
  )
}
