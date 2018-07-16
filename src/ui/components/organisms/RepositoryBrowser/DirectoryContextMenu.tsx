import React from "react"
import { ContextMenu, Item, Separator } from "react-contexify"
import { connect } from "react-redux"
import * as EditorActions from "../../../actions/editorActions"
import { RootState } from "../../../reducers"
import * as RepositoryActions from "../../../reducers/repository"

type OwnProps = {
  root: string
}

type Props = OwnProps & (typeof actions)

const actions = {
  startFileCreating: RepositoryActions.startFileCreating,
  startDirCreating: RepositoryActions.startDirCreating,
  addToStage: EditorActions.addToStage,
  deleteFile: EditorActions.deleteFile,
  deleteDirectory: EditorActions.deleteDirectory
}

export const DirectoryContextMenu: any = connect(
  (_state: RootState, ownProps: OwnProps) => {
    return ownProps
  },
  actions
)((props: Props) => {
  return (
    <ContextMenu id="directory">
      <Item
        onClick={({ dataFromProvider }: any) => {
          const { dirpath } = dataFromProvider
          props.startFileCreating({ fileCreatingDir: dirpath })
        }}
      >
        Create File
      </Item>
      <Item
        onClick={({ dataFromProvider }: any) => {
          const { dirpath } = dataFromProvider
          props.startDirCreating({ dirCreatingDir: dirpath })
        }}
      >
        Create Directory
      </Item>
      <Separator />
      <Item
        onClick={({ dataFromProvider }: any) => {
          // props.deleteFile(dataFromProvider.filepath)
          props.deleteDirectory({ dirpath: dataFromProvider.dirpath })
        }}
      >
        Delete
      </Item>
    </ContextMenu>
  )
})
