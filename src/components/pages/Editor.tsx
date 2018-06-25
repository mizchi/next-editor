import * as React from "react"
import { GlobalHeader } from "../molecules/GlobalHeader"
import { EditorContent } from "../organisms/EditorContent"
import { ProjectManager } from "../organisms/ProjectManager"
import { RepositoryBrowser } from "../organisms/RepositoryBrowser"
import { Grid, GridArea, Root } from "../utils/LayoutUtils"

export function Editor() {
  return (
    <Root>
      {/* prettier-ignore */}
      <Grid
        columns={["250px", "1fr"]}
        rows={[
          "40px",
          "1fr"
        ]}
        areas={[
          ["header", "header"],
          ["menu",   "content"],
        ]}
      >
        <GridArea name="header">
          <GlobalHeader />
        </GridArea>
        <GridArea name="menu">
          <Menu/>
        </GridArea>
        <GridArea name="content">
          <EditorContent/>
        </GridArea>
      </Grid>
    </Root>
  )
}

function Menu() {
  return (
    <>
      <ProjectManager />
      <RepositoryBrowser />
    </>
  )
}
