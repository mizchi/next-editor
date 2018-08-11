import {
  Alignment,
  AnchorButton,
  Button,
  Card,
  Classes,
  Intent,
  ITreeNode,
  Menu,
  Navbar,
  NavbarDivider,
  NavbarGroup,
  NavbarHeading,
  Popover,
  Position,
  Tab,
  Tabs,
  TextArea,
  Toaster,
  Tree
} from "@blueprintjs/core"
import React from "react"
import styled from "styled-components"
import { Root } from "../atoms/Root"
import { Grid, GridArea } from "../utils/Grid"

export const AppToaster = Toaster.create({
  position: Position.RIGHT_BOTTOM as any
})

export function Playground() {
  return (
    <Root className="bp3-dark">
      <Navigation />
      <ContentsBody>
        <Main />
      </ContentsBody>
    </Root>
  )
}

const StyledNavbar = styled(Navbar)``

const ContentsBody = styled.div`
  padding: 0;
  margin: 0;
  width: 100%;
  /* NOTE: StyledNavbar height is 50px */
  height: calc(100vh - 32px);
  border-radius: none;
`

class Navigation extends React.PureComponent<{}> {
  public render() {
    // return (
    //   <Button
    //     onClick={() => AppToaster.show({ message: "Toasted" })}
    //     text="show toast"
    //   />
    // )
    return (
      <StyledNavbar className={Classes.DARK}>
        <NavbarGroup align={Alignment.LEFT}>
          <NavbarHeading>NextEditor</NavbarHeading>
          <NavbarDivider />

          <Popover
            content={<HeaderFileMenu />}
            position={Position.BOTTOM_LEFT}
            minimal={true}
          >
            <Button className="bp3-minimal" icon="cog" text="File" />
          </Popover>
        </NavbarGroup>
        <NavbarGroup align={Alignment.RIGHT}>
          <Button className="bp3-minimal" icon="cog" />
        </NavbarGroup>
      </StyledNavbar>
    )
  }
}

function HeaderFileMenu() {
  return (
    <Menu>
      <Menu.Item icon="new-text-box" text="aaa" />
      <Menu.Item icon="new-text-box" text="bbb" />
      <Menu.Item icon="new-text-box" text="ccc" />
    </Menu>
  )
}

function Main() {
  return (
    <Grid
      rows={["1fr"]}
      columns={["250px", "1fr", "1fr"]}
      areas={[["aaa", "bbb", "ccc"]]}
    >
      <GridArea name="aaa">
        {/* <SideMenu /> */}
        <Card style={{ height: "100%", color: "#eee" }}>
          <TreeExample />
        </Card>
      </GridArea>
      <GridArea name="bbb">
        <TextArea
          fill={true}
          large={true}
          intent={Intent.PRIMARY}
          style={{ height: "100%", color: "black" }}
          spellCheck={false}
          // onChange={this.handleChange}
          // value={this.state.value}
        />
      </GridArea>
      <GridArea name="ccc">
        <Card style={{ color: "#eee", borderRadius: 0, height: "100%" }}>
          <Tabs
            id="TabsExample"
            onChange={() => {
              console.log("xx")
            }}
            selectedTabId="git-easy"
          >
            <Tab
              id="git-easy"
              title="Git Easy"
              panel={
                <div>
                  <Button icon="bookmark" text="Commit" />
                  <table
                    className="bp3-html-table .modifier bp3-small bp3-interactive"
                    style={{ width: "100%" }}
                  >
                    <thead>
                      <tr>
                        <th>Hash</th>
                        <th>Message</th>
                        <th>Author</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>oaidxpb</td>
                        <td>Update</td>
                        <td>mizchi</td>
                      </tr>
                      <tr>
                        <td>oaidxpb</td>
                        <td>Update</td>
                        <td>mizchi</td>
                      </tr>
                      <tr>
                        <td>oaidxpb</td>
                        <td>Update</td>
                        <td>mizchi</td>
                      </tr>
                      <tr>
                        <td>oaidxpb</td>
                        <td>Update</td>
                        <td>mizchi</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              }
            />
            <Tab id="git" title="Git" panel={<div>mb</div>} />
            <Tab id="history" title="History" panel={<div>react</div>} />
          </Tabs>
        </Card>
      </GridArea>
    </Grid>
  )
}

function SideMenu() {
  return (
    <SideMenuContainer>
      <h5>File Browser</h5>
    </SideMenuContainer>
  )
}

const SideMenuContainer = styled(Card)`
  height: 100%;
`

export interface ITreeExampleState {
  nodes: ITreeNode[]
}

// use Component so it re-renders everytime: `nodes` are not a primitive type
// and therefore aren't included in shallow prop comparison
export class TreeExample extends React.Component<{}, ITreeExampleState> {
  state = { nodes: INITIAL_STATE }

  render() {
    return (
      <Tree
        contents={this.state.nodes}
        onNodeClick={this.handleNodeClick}
        onNodeCollapse={this.handleNodeCollapse}
        onNodeExpand={this.handleNodeExpand}
        className={Classes.ELEVATION_0}
      />
    )
  }

  handleNodeClick = (
    nodeData: ITreeNode,
    _nodePath: number[],
    e: React.MouseEvent<HTMLElement>
  ) => {
    const originallySelected = nodeData.isSelected
    if (!e.shiftKey) {
      this.forEachNode(this.state.nodes, n => (n.isSelected = false))
    }
    nodeData.isSelected =
      originallySelected == null ? true : !originallySelected
    this.setState(this.state)
  }

  handleNodeCollapse = (nodeData: ITreeNode) => {
    nodeData.isExpanded = false
    this.setState(this.state)
  }

  private handleNodeExpand = (nodeData: ITreeNode) => {
    nodeData.isExpanded = true
    this.setState(this.state)
  }

  private forEachNode(nodes: ITreeNode[], callback: (node: ITreeNode) => void) {
    if (nodes == null) {
      return
    }

    for (const node of nodes) {
      callback(node)
      this.forEachNode(node.childNodes as any, callback)
    }
  }
}

/* tslint:disable:object-literal-sort-keys so childNodes can come last */
const folder = (name: string, childNodes: any = []) => ({
  id: "id:" + Math.random().toString(),
  hasCaret: true,
  icon: "folder-close",
  label: name,
  childNodes
})

const file = (name: string) => ({
  id: "id:" + Math.random().toString(),
  icon: "document",
  label: name
})

const INITIAL_STATE: any = [
  folder("aaa", [
    file("iii"),
    file("jjj")
    // file("jjj)
  ]),
  folder("bbb"),
  file("xxx"),
  file("yyy")
]
