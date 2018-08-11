import {
  Alignment,
  Button,
  Classes,
  Menu,
  MenuDivider,
  MenuItem,
  Navbar,
  NavbarDivider,
  NavbarGroup,
  NavbarHeading,
  Popover,
  Position
} from "@blueprintjs/core"
import React from "react"
import styled from "styled-components"
import { connector } from "../../actionCreators"
import { NavigatorTitle } from "../atoms/NavgatorTitle"

export const GlobalHeader = connector(
  state => ({
    mainLayout: state.app.mainLayout,
    networkOnline: state.app.networkOnline,
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
          <NavigatorTitle networkOnline={props.networkOnline} />
        </NavbarHeading>
        <NavbarDivider />

        <Popover
          content={<RepositoryMenu />}
          position={Position.BOTTOM_LEFT}
          minimal={true}
          lazy={false}
        >
          <Button className="bp3-minimal" icon="projects" text="Repository" />
        </Popover>

        <Popover
          content={<ViewMenu />}
          position={Position.BOTTOM_LEFT}
          minimal={true}
          lazy={false}
        >
          <Button className="bp3-minimal" icon="grid-view" text="View" />
        </Popover>
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

export const ViewMenu = connector(
  _state => ({}),
  actions => {
    return {
      pushScene: actions.app.pushScene,
      setLayout1: actions.app.setLayout1,
      setLayout2: actions.app.setLayout2,
      setLayout3: actions.app.setLayout3,
      setLayout4: actions.app.setLayout4
    }
  }
)(function ViewMenuImpl(props) {
  return (
    <Menu>
      <MenuItem
        icon="page-layout"
        text="Layout 1: Ctrl-1"
        onClick={() => props.setLayout1({})}
      />
      <MenuItem
        icon="page-layout"
        text="Layout 2: Ctrl-2"
        onClick={() => props.setLayout2({})}
      />
      <MenuItem
        icon="page-layout"
        text="Layout 3: Ctrl-3"
        onClick={() => props.setLayout3({})}
      />
      <MenuItem
        icon="page-layout"
        text="Layout 4: Ctrl-4"
        onClick={() => props.setLayout4({})}
      />
    </Menu>
  )
})

export const RepositoryMenu = connector(
  state => ({
    projects: state.project.projects
  }),
  actions => {
    return {
      openProject: actions.editor.startProjectRootChanged,
      openCreateRepoModal: actions.app.openCreateRepoModal,
      openCloneRepoModal: actions.app.openCloneRepoModal
    }
  }
)(function RepositoryMenuImpl(props) {
  return (
    <Menu>
      <MenuItem
        icon="add"
        text="Create repository"
        onClick={() => props.openCreateRepoModal({})}
      />
      <MenuItem
        icon="git-repo"
        text="Clone repository"
        onClick={() => props.openCloneRepoModal({})}
      />
      <li className="bp3-menu-header">
        <h6 className="bp3-heading">Open</h6>
      </li>
      {props.projects.map((p, index) => {
        return (
          <MenuItem
            icon="document-open"
            key={index}
            text={p.projectRoot}
            onClick={() => props.openProject({ projectRoot: p.projectRoot })}
          />
        )
      })}
    </Menu>
  )
})
