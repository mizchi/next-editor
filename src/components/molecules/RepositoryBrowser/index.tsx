import React from "react"
import { connect } from "react-redux"
import { RootState } from "../../../reducers"
import { commitChanges, RepositoryState } from "../../../reducers/repository"
import { RootDirectory } from "./Directory"
import { FileContextMenu } from "./FileContextMenu"

const selector = (state: RootState) => {
  return state.repository
}

const actions = {
  commitChanges
}

type Props = RepositoryState & {
  commitChanges: typeof commitChanges
}

export const RepositoryBrowser = connect(
  selector,
  actions
)((props: Props) => {
  return (
    <div>
      <button
        onClick={() => {
          props.commitChanges(props.currentProjectRoot, "Update")
        }}
      >
        Commit
      </button>
      <RootDirectory
        root={props.currentProjectRoot}
        dPath={props.currentProjectRoot}
        depth={0}
        open
      />
      <FileContextMenu root={props.currentProjectRoot} />
    </div>
  )
})
