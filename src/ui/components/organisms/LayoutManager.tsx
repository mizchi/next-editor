import flatten from "lodash/flatten"
import uniq from "lodash/uniq"
import React from "react"
import { lifecycle } from "recompose"
import { connector } from "../../actionCreators"
import { AreaName } from "../../reducers/app"
import { Grid, GridArea } from "../utils/Grid"
import { Editor } from "./Editor"
import { UserSupport } from "./UserSupport"

const AreaMap: any = {
  editor: Editor,
  support: UserSupport
}

export const LayoutManager = connector(
  state => {
    return {
      mainLayout: state.app.mainLayout
    }
  },
  actions => {
    return {
      setLayoutAreas: actions.app.setLayoutAreas
    }
  }
)(props => {
  const { mainLayout, setLayoutAreas } = props
  const areaNames: AreaName[] = uniq(flatten(mainLayout.areas))
  return (
    <>
      <Keydown
        keydown={(e: KeyboardEvent) => {
          // 1
          if (e.ctrlKey && e.keyCode === 49) {
            setLayoutAreas({ areas: [["editor"]] })
          }
          // 2
          if (e.ctrlKey && e.keyCode === 50) {
            setLayoutAreas({ areas: [["editor", "support"]] })
          }
        }}
      />
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
    </>
  )
})

export const Keydown: React.ComponentType<{
  keydown: any
}> = lifecycle({
  componentDidMount() {
    const self: any = this
    self._keydown = self.props.keydown
    window.addEventListener("keydown", self._keydown)
  },
  componentWillUnmount() {
    const self: any = this
    window.removeEventListener("keydown", self._keydown)
  }
})(_ => [] as any) as any
