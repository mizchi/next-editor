import React from "react"
import { connect } from "react-redux"
import { RootState } from "../../../reducers"
import { RepositoryState } from "../../../reducers/repository"
import { RootDirectory } from "./Directory"
import { FileContextMenu } from "./FileContextMenu"

const selector = (state: RootState) => {
  return state.repository
}

type Props = RepositoryState

export const RepositoryBrowser = connect(selector)((props: Props) => {
  return (
    <div>
      <RootDirectory
        root={props.currentProjectRoot}
        dPath={props.currentProjectRoot}
        depth={0}
        open
      />
      <FileContextMenu />
    </div>
  )
})
