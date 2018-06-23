import React from "react"
import { connect } from "react-redux"
import styled from "styled-components"
import { GitRepositoryStatus } from "../../../domain/types"
import { RootState } from "../../../reducers"
import {
  addToStage,
  checkoutToOtherBranch,
  commitStagedChanges,
  commitUnstagedChanges,
  createBranch,
  removeFileFromGit,
  updateGitStatus
} from "../../../reducers/repository"
import { GitBranchController } from "./GitBranchController"
import { GitCommitHistory } from "./GitCommitHistory"
import { GitCommitStatus } from "./GitCommitStatus"
import { GitPushManager } from "./GitPushManager"

const actions = {
  addToStage,
  createBranch,
  checkoutToOtherBranch,
  commitStagedChanges,
  commitUnstagedChanges,
  updateGitStatus,
  removeFileFromGit
}

type Props = (typeof actions) & {
  gitRepositoryStatus: GitRepositoryStatus
  gitStatusLoading: boolean
  gitTouchCounter: number
  projectRoot: string
  touchCounter: number
}

const selector = (state: RootState) => {
  return {
    gitRepositoryStatus: state.repository.gitRepositoryStatus,
    gitStatusLoading: state.repository.gitStatusLoading,
    gitTouchCounter: state.repository.gitTouchCounter,
    projectRoot: state.repository.currentProjectRoot,
    touchCounter: state.repository.fsTouchCounter
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
      const { projectRoot, gitRepositoryStatus, gitStatusLoading } = this.props
      if (gitRepositoryStatus) {
        const { currentBranch, branches, history } = gitRepositoryStatus
        const { untracked } = gitRepositoryStatus
        const { staged, unstaged, rawStatusList } = gitRepositoryStatus
        const stagedChanges: any = staged.map(s => {
          return rawStatusList.find(change => change.relpath === s)
        })
        const unstagedChanges: any = unstaged.map(u => {
          return rawStatusList.find(change => change.relpath === u)
        })
        return (
          <Container key={projectRoot}>
            <h2>Git Browser</h2>
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
            <GitPushManager projectRoot={projectRoot} />
            <GitBranchController
              projectRoot={projectRoot}
              currentBranch={currentBranch}
              branches={branches}
              onChangeBranch={async (branchName: string) => {
                await this.props.checkoutToOtherBranch(projectRoot, branchName)
                this.props.updateGitStatus(this.props.projectRoot)
              }}
              onClickCreateBranch={async (newBranchName: string) => {
                await this.props.createBranch(projectRoot, newBranchName)
                this.props.updateGitStatus(this.props.projectRoot)
              }}
            />
            <GitCommitStatus
              loading={gitStatusLoading}
              stagedChanges={stagedChanges}
              unstagedChanges={unstagedChanges}
              untracked={untracked}
              onClickGitAdd={(filepath: string) => {
                this.props.addToStage(projectRoot, filepath)
              }}
              onClickGitRemove={(filepath: string) => {
                this.props.removeFileFromGit(projectRoot, filepath)
              }}
              onClickGitCommit={(message: string) => {
                this.props.commitStagedChanges(projectRoot, message || "Update")
              }}
              onClickGitCommitUnstaged={(message: string) => {
                this.props.commitUnstagedChanges(
                  projectRoot,
                  unstagedChanges,
                  message || "Update"
                )
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
