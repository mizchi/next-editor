import React from "react"
import { ContextMenu, Item } from "react-contexify"
import { connect } from "react-redux"
import * as RepositoryActions from "../../../reducers/repository"

type Props = (typeof RepositoryActions) & {
  filepath: string
}

const onClick: any = ({ event, ref, data, dataFromProvider }: any) =>
  console.log("Hello", ref, data, dataFromProvider)

export const FileContextMenu = connect(
  (_: any, ownProps: any) => ownProps,
  RepositoryActions
)((props: Props) => {
  return (
    <ContextMenu id="menu_id">
      <Item
        onClick={({ dataFromProvider }: any) => {
          console.log("delete", dataFromProvider.filepath)
          props.deleteFile(dataFromProvider.filepath)
        }}
      >
        Delete
      </Item>
    </ContextMenu>
  )
})
