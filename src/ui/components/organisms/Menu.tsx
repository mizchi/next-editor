import React from "react"
import { ProjectManager } from "./ProjectManager"
import { RepositoryBrowser } from "./RepositoryBrowser"

export function Menu() {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div>
        <ProjectManager />
      </div>

      <div style={{ flex: 1, paddingBottom: "5px" }}>
        <RepositoryBrowser />
      </div>
    </div>
  )
}
