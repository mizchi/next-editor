import React from "react"
import { connect } from "react-redux"
import { RootState } from "../../../reducers"
import { RepositoryState } from "../../../reducers/repository"
import { RootDirectory } from "./Directory"
import { DirectoryContextMenu } from "./DirectoryContextMenu"
import { FileContextMenu } from "./FileContextMenu"

const selector = (state: RootState) => {
  return state.repository
}

type Props = RepositoryState

export const RepositoryBrowser = connect(selector)((props: Props) => {
  return (
    <fieldset style={{ padding: 0 }}>
      <legend>Files</legend>
      <RootDirectory
        key={props.currentProjectRoot}
        root={props.currentProjectRoot}
        dirpath={props.currentProjectRoot}
        depth={0}
        open
      />
      <FileContextMenu root={props.currentProjectRoot} />
      <DirectoryContextMenu root={props.currentProjectRoot} />
    </fieldset>
  )
})
