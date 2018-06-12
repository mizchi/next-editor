import React from "react"
import { connect } from "react-redux"
import styled from "styled-components"
import {
  CommitDescription,
  getLogInRepository,
  getProjectGitStatus,
  GitRepositoryStatus
} from "../../../lib/repository"
import { RootState } from "../../../reducers"
import { checkoutBranch, createBranch } from "../../../reducers/repository"

type Props = {
  projectRoot: string
  touchCounter: number
  createBranch: typeof createBranch
  checkoutBranch: typeof checkoutBranch
}

type State = {
  repositoryStatus: GitRepositoryStatus | null
  history: CommitDescription[]
}

const selector = (state: RootState) => {
  return {
    gitTouchCounter: state.repository.gitTouchCounter,
    projectRoot: state.repository.currentProjectRoot,
    touchCounter: state.repository.touchCounter
  }
}

const actions = { createBranch, checkoutBranch }

export const GitStatusViewer = connect(
  selector,
  actions
)(
  class extends React.Component<Props, State> {
    private newBranchInputRef: any = React.createRef()
    constructor(props: Props) {
      super(props)
      this.state = {
        history: [],
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
      const { repositoryStatus, history } = this.state
      if (repositoryStatus) {
        const { currentBranch, branches } = repositoryStatus
        const { untracked } = repositoryStatus.trackingStatus
        const { modified, added, staged } = repositoryStatus.stagingStatus
        return (
          <Container>
            <h2>Git Status</h2>
            <p>ProjectRoot: {projectRoot}</p>
            <p>current branch: {currentBranch}</p>
            <div>
              Switch branch:
              <select
                value={currentBranch}
                onChange={async ev => {
                  await this.props.checkoutBranch(projectRoot, ev.target.value)
                  this._updateStatus()
                }}
              >
                {branches.map(branchName => (
                  <option value={branchName} key={branchName}>
                    {branchName}
                  </option>
                ))}
              </select>
            </div>
            <div>
              Create branch:
              <input ref={this.newBranchInputRef} />
              &nbsp;
              <button
                onClick={async () => {
                  const newBranchName = this.newBranchInputRef.current.value
                  this.newBranchInputRef.current.value = ""
                  await this.props.createBranch(projectRoot, newBranchName)
                  this._updateStatus()
                }}
              >
                create
              </button>
            </div>
            <hr />
            <h3>staging</h3>
            <div>
              <button>Commit</button>
              <input placeholder="Commit massage here ..." />
            </div>
            {added.map(filepath => {
              return <div key={filepath}>Added: {filepath}</div>
            })}
            {staged.map(filepath => {
              return <div key={filepath}>Changed: {filepath}</div>
            })}
            <hr />
            <h3>modified</h3>
            {modified.map(filepath => {
              return (
                <div key={filepath}>
                  {filepath}
                  &nbsp;
                  <button>add to stage</button>
                </div>
              )
            })}
            <hr />
            {untracked.length > 0 && (
              <>
                <h3>untracked</h3>
                {untracked.map(filepath => {
                  return (
                    <div key={filepath}>
                      {filepath}
                      &nbsp;
                      <button>add to stage </button>
                    </div>
                  )
                })}
                <hr />
              </>
            )}
            <h3>Log</h3>
            <div style={{ fontFamily: "monospace" }}>
              {history.map((descrption, idx) => {
                return (
                  <div key={descrption.oid}>
                    {descrption.oid.slice(0, 7)} - {descrption.message}
                  </div>
                )
              })}
            </div>
          </Container>
        )
      } else {
        return <span>Loading</span>
      }
    }

    private async _updateStatus() {
      const { projectRoot } = this.props
      // const gitFiles = await listGitFilesInRepository(projectRoot)
      const repositoryStatus = await getProjectGitStatus(projectRoot)
      const history = await getLogInRepository(projectRoot, {})
      this.setState({ repositoryStatus, history })
    }
  }
)

const Container = styled.div`
  padding: 10px;
`
