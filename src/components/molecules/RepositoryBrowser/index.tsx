import React from "react"
import { ProjectConsumer } from "../../../contexts/ProjectContext"
import { RootDirectory } from "./Directory"

export function RepositoryBrowser() {
  return (
    <ProjectConsumer>
      {(context: any) => {
        return (
          <div>
            <RootDirectory
              repo={context.repo}
              dPath={context.repo.dir}
              depth={0}
              open
            />
          </div>
        )
      }}
    </ProjectConsumer>
  )
}
