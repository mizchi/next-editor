import faTrash from "@fortawesome/fontawesome-free-solid/faTrash"
import Icon from "@fortawesome/react-fontawesome"
import React from "react"
import { ContextMenu, Item } from "react-contexify"
import { connect } from "react-redux"
import * as RepositoryActions from "../../../reducers/repository"

const selector = () => ({})

const actions = {
  deleteProject: RepositoryActions.deleteProject
}

type Props = typeof actions

export const ProjectContextMenu: any = connect(
  selector,
  actions
)((props: Props) => {
  return (
    <ContextMenu id="project">
      <Item
        disabled={({ dataFromProvider }: any) =>
          dataFromProvider.dirpath === "/playground"
        }
        onClick={({ dataFromProvider }: any) => {
          props.deleteProject(dataFromProvider.dirpath)
        }}
      >
        <Icon icon={faTrash} />
        Delete project
      </Item>
    </ContextMenu>
  )
})
