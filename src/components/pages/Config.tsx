import * as React from "react"
import { AllAction, connector } from "../../reducers"
import { GlobalHeader } from "../molecules/GlobalHeader"
import { Config as ConfigContent } from "../organisms/Config"
import { Grid, GridArea, Root } from "../utils/LayoutUtils"

const selector = () => ({})
const actionSelector = (actions: AllAction) => {
  return {
    popScene: actions.app.popScene
  }
}

export const Config = connector(selector, actionSelector)((props: any) => {
  return (
    <Root>
      {/* prettier-ignore */}
      <Grid
        columns={["1fr"]}
        rows={[
          "40px",
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
