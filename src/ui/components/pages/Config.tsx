import * as React from "react"
import { connector } from "../../actions"
import { Config as ConfigContent } from "../organisms/Config"
import { GlobalHeader } from "../organisms/GlobalHeader"
import { Grid, GridArea, Root } from "../utils/LayoutUtils"

export const Config = connector(
  state => ({
    config: state.config
  }),
  actions => {
    return {
      setConfigValue: actions.config.setConfigValue,
      popScene: actions.app.popScene
    }
  }
)(props => {
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
          <ConfigContent
            config={props.config}
            onClickBack={() => props.popScene()}
            onChangeConfigValue={(key, value) => {
              props.setConfigValue({key, value})
            }}
          />
        </GridArea>
      </Grid>
    </Root>
  )
})
