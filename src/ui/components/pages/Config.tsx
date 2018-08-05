import * as React from "react"
import { connector } from "../../actionCreators"
import { Root } from "../atoms/Root"
import { Config as ConfigContent } from "../organisms/Config"
import { GlobalHeader } from "../organisms/GlobalHeader"
import { Grid, GridArea } from "../utils/Grid"

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
)(function ConfigImpl(props) {
  return (
    <Root>
      {/* prettier-ignore */}
      <Grid
        columns={["1fr"]}
        rows={[
          "32px",
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
            onClickBack={() => props.popScene({})}
            onChangeConfigValue={(key, value) => {
              props.setConfigValue({key, value})
            }}
          />
        </GridArea>
      </Grid>
    </Root>
  )
})
