import * as React from "react"
import { Root } from "../atoms/Root"
import { EditFooter } from "../organisms/EditFooter"
import { Editor } from "../organisms/Editor"
import { GlobalHeader } from "../organisms/GlobalHeader"
import { Grid, GridArea } from "../utils/Grid"

export function Edit() {
  return (
    <Root data-testid="edit">
      {/* prettier-ignore */}
      <Grid
        columns={["1fr"]}
        rows={[
          "32px",
          "1fr",
          "32px"
        ]}
        areas={[
          ["header"],
          ["content"],
          ["footer"]
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
          <Editor />
        </GridArea>
        <GridArea
          name="footer"
        >
          <EditFooter />
        </GridArea>

      </Grid>
    </Root>
  )
}
