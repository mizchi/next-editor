import React from "react"
import { ContextMenu, Item } from "react-contexify"
import { connect } from "react-redux"
import { ProjectConsumer } from "../../../contexts/ProjectContext"
import * as RepositoryActions from "../../../reducers/repository"
import { RootDirectory } from "./Directory"
import { FileContextMenu } from "./FileContextMenu"

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
            <FileContextMenu />
          </div>
        )
      }}
    </ProjectConsumer>
  )
}
