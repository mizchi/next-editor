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
      deleteProject: actions.editor.deleteProject
    }
  },
  lifecycle({
    componentDidMount() {
      ;(this as any).props.loadProjectList()
    }
  })
)(props => {
  return (
    <ProjectManagerImpl
      projectRoot={props.repository.currentProjectRoot}
      projects={props.project.projects}
      githubProxy={props.githubProxy}
      onCreateNewProject={async projectRoot => {
        const newProjectRoot = path.join("/", projectRoot)
        // TODO: fix it
        props.createNewProject({ newProjectRoot })
        await new Promise(r => setTimeout(r, 300))
        props.startProjectRootChanged({
          projectRoot: newProjectRoot
        })
      }}
      onCloneEnd={projectRoot => {
        props.startProjectRootChanged({ projectRoot })
      }}
      onChangeProject={projectRoot => {
        props.startProjectRootChanged({ projectRoot })
      }}
      onDeleteProject={async projectRoot => {
        // TODO: Use domain directly
        props.deleteProject({
          dirpath: projectRoot
        })
        await new Promise(r => setTimeout(r, 300))
        props.startProjectRootChanged({
          projectRoot: "/playground"
        })
      }}
    />
  )
})

class ProjectManagerImpl extends React.Component<{
  projectRoot: string
  projects: Array<{ projectRoot: string }>
  githubProxy: string
  onChangeProject: (projectRoot: string) => void
  onCloneEnd: (projectRoot: string) => void
  onDeleteProject: (projectRoot: string) => void
  onCreateNewProject: (projectRoot: string) => void
}> {
  render() {
    const {
      githubProxy,
      projects,
      onCreateNewProject,
      onChangeProject,
      onCloneEnd,
      projectRoot,
      onDeleteProject
    } = this.props

    return (
      <Card style={{ height: "100%", borderRadius: 0 }}>
        <div>
          <div className="bp3-select .modifier">
            <select
              value={projectRoot}
              onChange={ev => {
                const nextProjectRoot = ev.target.value
                onChangeProject(nextProjectRoot)
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
            disabled={projectRoot === "/playground"}
            icon="trash"
            onClick={async () => {
              const confirmed = window.confirm(`Delete ${projectRoot}`)
              if (confirmed) {
                onDeleteProject(projectRoot)
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
                    onCreateNewProject(dirname)
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
                  githubProxy={githubProxy}
                  onConfirm={async newProjectRoot => {
                    onClose()
                    onCloneEnd(newProjectRoot)
                  }}
                  onCancel={onClose as any}
                />
              )
            }}
          />
        </ButtonGroup>
      </Card>
    )
  }
}
