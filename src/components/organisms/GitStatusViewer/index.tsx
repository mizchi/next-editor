import React from "react"
import { connect } from "react-redux"
import styled from "styled-components"
import { GitRepositoryStatus } from "../../../lib/repository"
import { RootState } from "../../../reducers"
import {
  addToStage,
  checkoutBranch,
  commitChanges,
  createBranch,
  updateGitStatus
} from "../../../reducers/repository"
import { GitBranchController } from "./GitBranchController"
import { GitCommitHistory } from "./GitCommitHistory"
import { GitCommitStatus } from "./GitCommitStatus"

const actions = {
  addToStage,
  createBranch,
  checkoutBranch,
  commitChanges,
  updateGitStatus
}

type Props = (typeof actions) & {
  gitRepositoryStatus: GitRepositoryStatus
  projectRoot: string
  touchCounter: number
  addToStage: typeof addToStage
  createBranch: typeof createBranch
  checkoutBranch: typeof checkoutBranch
  commitChanges: typeof commitChanges
}

const selector = (state: RootState) => {
  return {
    gitRepositoryStatus: state.repository.gitRepositoryStatus,
    gitTouchCounter: state.repository.gitTouchCounter,
    projectRoot: state.repository.currentProjectRoot,
    touchCounter: state.repository.touchCounter
  }
}

export const GitStatusViewer = connect(
  selector,
  actions
)(
  class extends React.PureComponent<Props> {
    async componentDidMount() {
      this.props.updateGitStatus(this.props.projectRoot)
    }

    async componentDidUpdate(prevProps: Props) {
      if (prevProps.touchCounter !== this.props.touchCounter) {
        this.props.updateGitStatus(this.props.projectRoot)
      }
    }

    render() {
      const { projectRoot, gitRepositoryStatus } = this.props
      if (gitRepositoryStatus) {
        const { currentBranch, branches, history } = gitRepositoryStatus
        const { untracked } = gitRepositoryStatus.trackingStatus
        const { modified, added, staged } = gitRepositoryStatus.stagingStatus
        return (
          <Container>
            <h2>Git Status</h2>
            <div>
              {projectRoot} [{currentBranch}]
              <button
                onClick={() =>
                  this.props.updateGitStatus(this.props.projectRoot)
                }
              >
                Reload status
              </button>
            </div>
            <GitBranchController
              projectRoot={projectRoot}
              currentBranch={currentBranch}
              branches={branches}
              onChangeBranch={async (branchName: string) => {
                await this.props.checkoutBranch(projectRoot, branchName)
                this.props.updateGitStatus(this.props.projectRoot)
              }}
              onClickCreateBranch={async (newBranchName: string) => {
                await this.props.createBranch(projectRoot, newBranchName)
                this.props.updateGitStatus(this.props.projectRoot)
              }}
            />
            <hr />
            <GitCommitStatus
              added={added}
              staged={staged}
              modified={modified}
              untracked={untracked}
              onClickGitAdd={(filepath: string) => {
                this.props.addToStage(projectRoot, filepath)
              }}
              onClickGitCommit={(message: string) => {
                this.props.commitChanges(projectRoot, message || "Update")
              }}
            />
            <GitCommitHistory history={history} />
          </Container>
        )
      } else {
        return <span>Loading</span>
      }
    }
  }
)

const Container = styled.div`
  padding: 10px;
`
