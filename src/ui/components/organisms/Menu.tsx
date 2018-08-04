import React from "react"
import { GridArea, GridRow } from "../utils/Grid"
import { ProjectManager } from "./ProjectManager"
import { RepositoryBrowser } from "./RepositoryBrowser"

export function Menu() {
  return (
    <GridRow rows={["90px", "1fr"]} areas={["project", "file-browser"]}>
      <GridArea name="project">
        <ProjectManager />
      </GridArea>
      <GridArea name="file-browser">
        <RepositoryBrowser />
      </GridArea>
    </GridRow>
  )
}
