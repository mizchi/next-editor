import {
  Alignment,
  Button,
  Classes,
  Navbar,
  NavbarGroup,
  NavbarHeading
} from "@blueprintjs/core"
import React from "react"
import styled from "styled-components"
import { connector } from "../../../actionCreators"

export const GlobalHeader = connector(
  state => ({
    mainLayout: state.app.mainLayout,
    currentScene: state.app.sceneStack[state.app.sceneStack.length - 1]
  }),
  actions => {
    return {
      pushScene: actions.app.pushScene
    }
  }
)(function GlobalHeaderImpl(props) {
  return (
    <StyledNavbar className={Classes.DARK}>
      <NavbarGroup align={Alignment.LEFT} style={sharedNavbarStyle}>
        <NavbarHeading style={{ ...sharedNavbarStyle, paddingTop: 5 }}>
          Next Editor
        </NavbarHeading>
        {/* <NavbarDivider />
        <Popover
          content={<HeaderFileMenu />}
          position={Position.BOTTOM_LEFT}
          minimal={true}
        >
          <Button className="bp3-minimal" icon="cog" text="File" />
        </Popover> */}
      </NavbarGroup>
      <NavbarGroup align={Alignment.RIGHT} style={sharedNavbarStyle}>
        <Button
          className="bp3-minimal"
          icon="cog"
          onClick={() => {
            props.pushScene({ nextScene: "config" })
          }}
        />
      </NavbarGroup>
    </StyledNavbar>
  )
})

const StyledNavbar = styled(Navbar)`
  height: 32px;
  padding-left: 12px;
  /* border-left: 1px solid rgba(0, 0, 0, 0.05);
  border-right: 1px solid rgba(0, 0, 0, 0.05);
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);
  box-shadow (rgba(255, 255, 255, .3) -1px 0 0); */
`

const sharedNavbarStyle = {
  height: 32
}

// function HeaderFileMenu() {
//   return (
//     <Menu>
//       <Menu.Item icon="new-text-box" text="aaa" />
//       <Menu.Item icon="new-text-box" text="bbb" />
//       <Menu.Item icon="new-text-box" text="ccc" />
//     </Menu>
//   )
// }
