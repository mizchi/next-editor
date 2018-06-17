import path from "path"
import React from "react"
import { connect } from "react-redux"
import { RootState } from "../../../reducers"
import * as ProjectActions from "../../../reducers/project"
import { ProjectState } from "../../../reducers/project"
import {
  deleteDirectory,
  deleteProject,
  projectRootChanged
} from "../../../reducers/repository"
import { CloneProjectButton } from "./CloneProjectButton"
import { CreateNewProjectButton } from "./CreateNewProjectButton"

type Props = (typeof ProjectActions) & {
  projectRootChanged: typeof projectRootChanged
  deleteProject: typeof deleteProject
} & {
  project: ProjectState
}

const selector = (state: RootState) => {
  return {
    project: state.project
  }
}

const actions = { ...ProjectActions, projectRootChanged, deleteProject }

export const ProjectManager = connect(
  selector,
  actions
)(
  class extends React.Component<Props> {
    componentDidMount() {
      this.props.loadProjectList()
    }
    render() {
      const { projects } = this.props.project
      const { createNewProject, cloneFromGitHub } = this.props
      return (
        <>
          <div>Projects</div>
          {projects.map(p => {
            return (
              <div key={p.projectRoot}>
                <button
                  onClick={() => {
                    this.props.projectRootChanged(p.projectRoot)
                  }}
                >
                  {p.projectRoot}
                </button>
                -
                <button
                  onClick={() => {
                    this.props.deleteProject(p.projectRoot)
                  }}
                >
                  delete
                </button>
              </div>
            )
          })}
          <div>
            <div>Add new project</div>
            <div>
              <CreateNewProjectButton
                onClickCreate={dirname => {
                  const newProjectRoot = path.join("/", dirname)
                  createNewProject(newProjectRoot)
                }}
              />
            </div>

            <div>
              <CloneProjectButton
                onClickClone={dirname => {
                  const clonePath =
                    "https://" +
                    path.join(
                      "cors-buster-tbgktfqyku.now.sh/github.com",
                      dirname
                    )
                  const [, repoName] = dirname.split("/")
                  const projectRoot = path.join("/", repoName)
                  cloneFromGitHub(projectRoot, clonePath)
                }}
              />
            </div>
          </div>
        </>
      )
    }
  }
)
