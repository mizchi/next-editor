import { Card } from "@blueprintjs/core"
import React from "react"
import { connector } from "../../../actionCreators"
import { RepositoryState } from "../../../reducers/repository"
import { DirectoryContextMenu } from "./DirectoryContextMenu"
import { RootDirectory } from "./DirectoryLine"
import { FileContextMenu } from "./FileContextMenu"

type Props = RepositoryState

export const RepositoryBrowser = connector(
  state => {
    return state.repository
  },
  () => ({})
)(function RepositoryBrowserImpl(props: Props) {
  return (
    <Card style={{ height: "100%", padding: 10, margin: 0 }}>
      {/* <fieldset style={{ padding: 0 }}> */}
      <RootDirectory
        key={props.currentProjectRoot}
        root={props.currentProjectRoot}
        dirpath={props.currentProjectRoot}
        depth={0}
        open
      />
      <FileContextMenu root={props.currentProjectRoot} />
      <DirectoryContextMenu root={props.currentProjectRoot} />
      {/* </fieldset> */}
    </Card>
  )
})
