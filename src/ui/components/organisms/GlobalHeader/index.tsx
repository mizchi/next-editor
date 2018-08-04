import {
  Alignment,
  Button,
  Classes,
  Navbar,
  NavbarGroup,
  NavbarHeading
} from "@blueprintjs/core"
import React from "react"
import { connector } from "../../../actionCreators"

export const GlobalHeader = connector(
  state => ({
    mainLayout: state.app.mainLayout,
    currentScene: state.app.sceneStack[state.app.sceneStack.length - 1]
  }),
  actions => {
    return {
      pushScene: actions.app.pushScene,
      setLayoutAreas: actions.app.setLayoutAreas
    }
  }
)(function GlobalHeaderImpl(props) {
  return (
    <Navbar className={Classes.DARK}>
      <NavbarGroup align={Alignment.LEFT}>
        <NavbarHeading>NextEditor</NavbarHeading>
        {/* <NavbarDivider />
        <Popover
          content={<HeaderFileMenu />}
          position={Position.BOTTOM_LEFT}
          minimal={true}
        >
          <Button className="bp3-minimal" icon="cog" text="File" />
        </Popover> */}
      </NavbarGroup>
      <NavbarGroup align={Alignment.RIGHT}>
        <Button
          className="bp3-minimal"
          icon="cog"
          onClick={() => {
            props.pushScene({ nextScene: "config" })
          }}
        />
      </NavbarGroup>
    </Navbar>
  )
})

// function HeaderFileMenu() {
//   return (
//     <Menu>
//       <Menu.Item icon="new-text-box" text="aaa" />
//       <Menu.Item icon="new-text-box" text="bbb" />
//       <Menu.Item icon="new-text-box" text="ccc" />
//     </Menu>
//   )
// }
