import React from "react"
import { connect } from "react-redux"
import styled from "styled-components"
import {
  getProjectGitStatus,
  GitRepositoryStatus
} from "../../../lib/repository"
import { RootState } from "../../../reducers"
import {
  addToStage,
  checkoutBranch,
  commitChanges,
  createBranch
} from "../../../reducers/repository"
import { GitBranchController } from "./GitBranchController"
import { GitCommitHistory } from "./GitCommitHistory"
import { GitCommitStatus } from "./GitCommitStatus"

type Props = {
  projectRoot: string
  touchCounter: number
  addToStage: typeof addToStage
  createBranch: typeof createBranch
  checkoutBranch: typeof checkoutBranch
  commitChanges: typeof commitChanges
}

type State = {
  repositoryStatus: GitRepositoryStatus | null
}

const selector = (state: RootState) => {
  return {
    gitTouchCounter: state.repository.gitTouchCounter,
    projectRoot: state.repository.currentProjectRoot,
    touchCounter: state.repository.touchCounter
  }
}

const actions = { addToStage, createBranch, checkoutBranch, commitChanges }

export const GitStatusViewer: any = connect(
  selector,
  actions
)(
  class extends React.Component<Props, State> {
    private newBranchInputRef: any = React.createRef()
    private commitMassageInputRef: any = React.createRef()
    constructor(props: Props) {
      super(props)
      this.state = {
        repositoryStatus: null
      }
    }

    async componentDidMount() {
      this._updateStatus()
    }

    async componentDidUpdate(prevProps: Props) {
      if (prevProps.touchCounter !== this.props.touchCounter) {
        this._updateStatus()
      }
    }

    render() {
      const { projectRoot } = this.props
      const { repositoryStatus } = this.state
      if (repositoryStatus) {
        const { currentBranch, branches, history } = repositoryStatus
        const { untracked } = repositoryStatus.trackingStatus
        const { modified, added, staged } = repositoryStatus.stagingStatus
        return (
          <Container>
            <h2>Git Status</h2>
            <div>
              {projectRoot} [{currentBranch}]
              <button onClick={() => this._updateStatus()}>
                Reload status
              </button>
            </div>
            <GitBranchController
              projectRoot={projectRoot}
              currentBranch={currentBranch}
              branches={branches}
              onChangeBranch={async (branchName: string) => {
                await this.props.checkoutBranch(projectRoot, branchName)
                this._updateStatus()
              }}
              onClickCreateBranch={async (newBranchName: string) => {
                await this.props.createBranch(projectRoot, newBranchName)
                this._updateStatus()
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

    private async _updateStatus() {
      const { projectRoot } = this.props
      const repositoryStatus = await getProjectGitStatus(projectRoot)
      this.setState({ repositoryStatus })
    }
  }
)

const Container = styled.div`
  padding: 10px;
`
