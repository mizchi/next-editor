import React from "react"
import { ContextMenu, Item, Separator } from "react-contexify"
import { connector } from "../../../actionCreators"
import { RootState } from "../../../reducers"

type OwnProps = {
  root: string
}

export const DirectoryContextMenu: any = connector(
  (_state: RootState, ownProps: OwnProps) => {
    return ownProps
  },
  actions => {
    return {
      startFileCreating: actions.repository.startFileCreating,
      startDirCreating: actions.repository.startDirCreating,
      addToStage: actions.editor.addToStage,
      deleteFile: actions.editor.deleteFile,
      deleteDirectory: actions.editor.deleteDirectory
    }
  }
)(function DirectoryContextMenuImpl(props) {
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
          props.deleteDirectory({ dirpath: dataFromProvider.dirpath })
        }}
      >
        Delete
      </Item>
    </ContextMenu>
  )
})
