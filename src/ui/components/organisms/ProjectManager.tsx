import { Button, ButtonGroup, Card } from "@blueprintjs/core"
import React from "react"
import { lifecycle } from "recompose"
import { connector } from "../../actionCreators"

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
      openCreateRepoModal: actions.app.openCreateRepoModal,
      openCloneRepoModal: actions.app.openCloneRepoModal,
      loadProjectList: actions.project.loadProjectList,
      startProjectRootChanged: actions.editor.startProjectRootChanged,
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
      onClickNewProject={() => {
        props.openCreateRepoModal({})
      }}
      onClickCloneProject={() => {
        props.openCloneRepoModal({})
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
  onClickNewProject: () => void
  onClickCloneProject: () => void
}> {
  render() {
    const {
      githubProxy,
      projects,
      onClickNewProject,
      onChangeProject,
      onCloneEnd,
      onClickCloneProject,
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
          <Button
            text="Add"
            icon="add"
            onClick={() => {
              onClickNewProject()
            }}
          />
          <Button
            text="Clone"
            icon="git-repo"
            onClick={() => {
              onClickCloneProject()
            }}
          />
        </ButtonGroup>
      </Card>
    )
  }
}
