import {
  Alignment,
  Button,
  Classes,
  Navbar,
  NavbarGroup
} from "@blueprintjs/core"
import React from "react"
import styled from "styled-components"
import { connector } from "../../actionCreators"

export const EditFooter = connector(
  state => ({
    currentScene: state.app.sceneStack[state.app.sceneStack.length - 1]
  }),
  actions => {
    return {
      popScene: actions.app.popScene
    }
  }
)(function EditFooterImpl(props) {
  return (
    <StyledNavbar className={Classes.DARK}>
      <NavbarGroup align={Alignment.RIGHT} style={sharedNavbarStyle}>
        <Button
          className="bp3-minimal"
          icon="undo"
          onClick={() => {
            props.popScene({})
          }}
        />
      </NavbarGroup>
    </StyledNavbar>
  )
})

const StyledNavbar = styled(Navbar)`
  height: 32px;
  padding-left: 12px;
`

const sharedNavbarStyle = {
  height: 32
}
