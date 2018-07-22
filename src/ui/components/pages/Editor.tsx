import * as React from "react"
import { EditorContent } from "../organisms/EditorContent"
import { GlobalHeader } from "../organisms/GlobalHeader"
import { Menu } from "../organisms/Menu"
import { Grid, GridArea } from "../utils/Grid"
import { Root } from "../utils/Root"

export function Editor() {
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
          <EditorContent/>
        </GridArea>
      </Grid>
    </Root>
  )
}
