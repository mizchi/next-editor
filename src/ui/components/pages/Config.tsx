import * as React from "react"
import { connector } from "../../reducers"
import { Config as ConfigContent } from "../organisms/Config"
import { GlobalHeader } from "../organisms/GlobalHeader"
import { Grid, GridArea, Root } from "../utils/LayoutUtils"

export const Config = connector(
  () => ({}),
  actions => {
    return {
      popScene: actions.app.popScene
    }
  }
)((props: any) => {
  return (
    <Root>
      {/* prettier-ignore */}
      <Grid
        columns={["1fr"]}
        rows={[
          "30px",
          "1fr"
        ]}
        areas={[
          ["header"],
          ["content"],
        ]}
      >
        <GridArea name="header">
          <GlobalHeader />
        </GridArea>
        <GridArea name="content">
          <ConfigContent onClickBack={() => props.popScene()} />
        </GridArea>
      </Grid>
    </Root>
  )
})
