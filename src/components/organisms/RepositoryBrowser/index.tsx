import React from "react"
import { connect } from "react-redux"
import { RootState } from "../../../reducers"
import {
  projectRootChanged,
  RepositoryState
} from "../../../reducers/repository"
import { RootDirectory } from "./Directory"
import { DirectoryContextMenu } from "./DirectoryContextMenu"
import { FileContextMenu } from "./FileContextMenu"

const selector = (state: RootState) => {
  return state.repository
}

const actions = {
  projectRootChanged
}

type Props = (typeof actions) & RepositoryState

export const RepositoryBrowser = connect(
  selector,
  actions
)((props: Props) => {
  return (
    <div>
      <RootDirectory
        key={props.currentProjectRoot}
        root={props.currentProjectRoot}
        dirpath={props.currentProjectRoot}
        depth={0}
        open
      />
      <FileContextMenu root={props.currentProjectRoot} />
      <DirectoryContextMenu root={props.currentProjectRoot} />
    </div>
  )
})
