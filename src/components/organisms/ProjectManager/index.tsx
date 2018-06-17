import React from "react"
import { connect } from "react-redux"
import { RootState } from "../../../reducers"
import * as ProjectActions from "../../../reducers/project"
import { ProjectState } from "../../../reducers/project"
import { CloneProjectButton } from "./CloneProjectButton"
import { CreateNewProjectButton } from "./CreateNewProjectButton"

type Props = (typeof ProjectActions) & {
  project: ProjectState
}

const selector = (state: RootState) => {
  return {
    project: state.project
  }
}

const actions = ProjectActions

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
      return (
        <>
          <div>Projects</div>
          {projects.map(p => {
            return (
              <div key={p.projectRoot}>
                <button>{p.projectRoot}</button>
              </div>
            )
          })}
          <div>
            <div>Add new project</div>
            <div>
              <CreateNewProjectButton />
            </div>

            <div>
              <CloneProjectButton />
            </div>
          </div>
        </>
      )
    }
  }
)
