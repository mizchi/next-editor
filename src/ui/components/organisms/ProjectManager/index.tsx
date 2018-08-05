import { Button, ButtonGroup, Card } from "@blueprintjs/core"
import path from "path"
import React from "react"
import { lifecycle } from "recompose"
import { connector } from "../../../actionCreators"
import { ButtonWithModal } from "../../atoms/ButtonWithModal"
import { CloneProjectModalContent } from "./CloneProjectModalContent"
import { CreateProjectModalContent } from "./CreateProjectModalContent"

export const ProjectManager = connector(
  state => {
    return {
      project: state.project,
      githubProxy: state.config.githubProxy,
      repository: state.repository
    }
  },
  actions => {
    return {
      loadProjectList: actions.project.loadProjectList,
      startProjectRootChanged: actions.editor.startProjectRootChanged,
      createNewProject: actions.project.createNewProject,
      cloneFromGitHub: actions.project.cloneFromGitHub,
      deleteProject: actions.editor.deleteProject
    }
  },
  lifecycle({
    componentDidMount() {
      ;(this as any).props.loadProjectList()
    }
  })
)(props => {
  const {
    createNewProject,
    cloneFromGitHub,
    githubProxy,
    project: { projects }
  } = props
  return (
    <Card style={{ height: "100%", borderRadius: 0 }}>
      <div>
        <div className="bp3-select .modifier">
          <select
            value={props.repository.currentProjectRoot}
            onChange={ev => {
              const nextProjectRoot = ev.target.value
              props.startProjectRootChanged({ projectRoot: nextProjectRoot })
            }}
          >
            {projects.map((p, index) => {
              return (
                <option value={p.projectRoot} key={index}>
                  {p.projectRoot}
                </option>
              )
            })}
          </select>
        </div>
        <Button
          disabled={props.repository.currentProjectRoot === "/playground"}
          icon="trash"
          onClick={async () => {
            const ret = window.confirm(
              `Delete ${props.repository.currentProjectRoot}`
            )
            if (ret) {
              props.deleteProject({
                dirpath: props.repository.currentProjectRoot
              })

              await new Promise(r => setTimeout(r, 300))
              props.startProjectRootChanged({
                projectRoot: "/playground"
              })
            }
          }}
        />
      </div>
      <div style={{ height: "5px" }} />
      <ButtonGroup>
        <ButtonWithModal
          text="Add"
          icon="add"
          renderModal={({ onClose }) => {
            return (
              <CreateProjectModalContent
                onConfirm={async dirname => {
                  onClose()
                  const newProjectRoot = path.join("/", dirname)
                  createNewProject({ newProjectRoot })
                  await new Promise(r => setTimeout(r, 300))
                  props.startProjectRootChanged({ projectRoot: newProjectRoot })
                }}
                onCancel={onClose}
              />
            )
          }}
        />
        <ButtonWithModal
          text="Clone"
          icon="git-repo"
          renderModal={({ onClose }) => {
            return (
              <CloneProjectModalContent
                onConfirm={async dirname => {
                  const clonePath = githubProxy + dirname
                  const [, repoName] = dirname.split("/")
                  const projectRoot = path.join("/", repoName)
                  cloneFromGitHub({ projectRoot, clonePath })
                  await new Promise(r => setTimeout(r, 300))
                  props.startProjectRootChanged({ projectRoot })
                }}
                onCancel={onClose as any}
              />
            )
          }}
        />
      </ButtonGroup>
    </Card>
  )
})
