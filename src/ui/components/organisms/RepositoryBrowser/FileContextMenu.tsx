import path from "path"
import React from "react"
import { ContextMenu, Item, Separator } from "react-contexify"
import { connect } from "react-redux"
import { RootState } from "../../../reducers"
import * as RepositoryActions from "../../../reducers/repository"

type OwnProps = {
  root: string
}

type Props = OwnProps & {
  addToStage: typeof RepositoryActions.addToStage
  deleteFile: typeof RepositoryActions.deleteFile
}

const actions = {
  addToStage: RepositoryActions.addToStage,
  deleteFile: RepositoryActions.deleteFile
}

export const FileContextMenu: any = connect(
  (_state: RootState, ownProps: OwnProps) => {
    return ownProps
  },
  actions
)((props: Props) => {
  return (
    <ContextMenu id="file">
      <Item
        onClick={({ dataFromProvider }: any) => {
          const relpath = path.relative(props.root, dataFromProvider.filepath)
          props.addToStage({ projectRoot: props.root, relpath })
        }}
      >
        Add to stage
      </Item>
      <Separator />
      <Item
        onClick={({ dataFromProvider }: any) => {
          props.deleteFile(dataFromProvider.filepath)
        }}
      >
        Delete
      </Item>
    </ContextMenu>
  )
})
