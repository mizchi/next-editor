import faBox from "@fortawesome/fontawesome-free-solid/faBox"
import faCog from "@fortawesome/fontawesome-free-solid/faCog"
import Icon from "@fortawesome/react-fontawesome"
import path from "path"
import React from "react"
import { ContextMenuProvider } from "react-contexify"
import { connect } from "react-redux"
import styled from "styled-components"
import { RootState } from "../../../reducers"
import { pushScene } from "../../../reducers/app"
import * as ProjectActions from "../../../reducers/project"
import { ProjectState } from "../../../reducers/project"
import {
  deleteProject,
  projectRootChanged,
  RepositoryState
} from "../../../reducers/repository"
import { CloneProjectButton } from "./CloneProjectButton"
import { CreateNewProjectButton } from "./CreateNewProjectButton"
import { ProjectContextMenu } from "./ProjectContextMenu"

type Props = (typeof ProjectActions) & {
  projectRootChanged: typeof projectRootChanged
  deleteProject: typeof deleteProject
  pushScene: typeof pushScene
} & {
  project: ProjectState
  repository: RepositoryState
}

const selector = (state: RootState) => {
  return {
    project: state.project,
    repository: state.repository
  }
}

const ProjectLineContainer = styled.div`
  padding: 3px;
`

const ProjectLineContent = styled.div`
  outline: 1px solid black;

  padding: 2px;

  color: green;
  background: #fff;

  &:hover {
    color: #fff;
    background: #888;
  }
`

const actions = {
  ...ProjectActions,
  projectRootChanged,
  deleteProject,
  pushScene
}

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
          <div>
            <div
              onClick={() => {
                this.props.pushScene("config")
              }}
            >
              <Icon icon={faCog} />
              &nbsp; Config
            </div>
          </div>
          <div>
            <CreateNewProjectButton
              onClickCreate={dirname => {
                const newProjectRoot = path.join("/", dirname)
                createNewProject(newProjectRoot)
              }}
            />
            &nbsp;
            <CloneProjectButton
              onClickClone={dirname => {
                const clonePath =
                  "https://" +
                  path.join("cors-buster-tbgktfqyku.now.sh/github.com", dirname)
                const [, repoName] = dirname.split("/")
                const projectRoot = path.join("/", repoName)
                cloneFromGitHub(projectRoot, clonePath)
              }}
            />
          </div>
          <ProjectContextMenu />
          {projects.map(p => {
            const isActive =
              p.projectRoot === this.props.repository.currentProjectRoot
            return (
              <ContextMenuProvider
                key={p.projectRoot}
                id="project"
                data={{ dirpath: p.projectRoot }}
              >
                <ProjectLineContainer
                  onClick={() => {
                    this.props.projectRootChanged(p.projectRoot)
                  }}
                >
                  <ProjectLineContent>
                    <Icon icon={faBox} />
                    <span
                      style={{
                        color: isActive ? "#4a4" : "black"
                      }}
                    >
                      {p.projectRoot}
                    </span>
                  </ProjectLineContent>
                </ProjectLineContainer>
              </ContextMenuProvider>
            )
          })}
        </>
      )
    }
  }
)

const Button = styled.a`
  display: inline-block;
  padding: 0.5em 1em;
  text-decoration: none;
  background: #668ad8;
  color: #fff;
  border-bottom: solid 4px #627295;
  border-radius: 3px;
  &:active {
    -ms-transform: translateY(4px);
    -webkit-transform: translateY(4px);
    transform: translateY(4px);
    border-bottom: none;
  }
`
