import { Card } from "@blueprintjs/core"
import flatten from "lodash/flatten"
import uniq from "lodash/uniq"
import React from "react"
import { connector } from "../../actionCreators"
import { AreaName } from "../../reducers/app"
import { Grid, GridArea } from "../utils/Grid"
import { Editor } from "./Editor"
import { GitController } from "./GitController"
import { Menu } from "./Menu"
import { UserSupport } from "./UserSupport"

const AreaMap: any = {
  editor: Editor,
  support: UserSupport,
  menu: Menu
}

export const LayoutManager = connector(
  state => {
    return {
      isMobile: state.app.isMobile,
      mainLayout: state.app.mainLayout
    }
  },
  _actions => {
    return {}
  }
)(function LayoutManagerImpl(props) {
  if (props.isMobile) {
    return (
      <div
        style={{
          boxSizing: "border-box",
          fontSize: "1.6em",
          padding: 10
        }}
      >
        <Menu />
        <Card>
          <GitController />
        </Card>
      </div>
    )
  }

  const { mainLayout } = props
  const areaNames: AreaName[] = uniq(flatten(mainLayout.areas))
  return (
    <Grid
      rows={mainLayout.rows}
      columns={mainLayout.columns}
      areas={mainLayout.areas}
    >
      {areaNames.map(area => {
        const C = AreaMap[area]
        if (C) {
          return (
            <GridArea key={area} name={area}>
              {<C />}
            </GridArea>
          )
        } else {
          return <span key={area}>Error: {area} is not registered area</span>
        }
      })}
    </Grid>
  )
})
