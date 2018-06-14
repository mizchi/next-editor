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
import {
  addToStage,
  checkoutBranch,
  commitChanges,
  createBranch
} from "../../../reducers/repository"

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
  history: CommitDescription[]
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
            <div>
              {projectRoot} [{currentBranch}]
              <button onClick={() => this._updateStatus()}>
                Reload status
              </button>
            </div>
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
              <button
                onClick={() => {
                  const value = this.commitMassageInputRef.current.value
                  this.props.commitChanges(projectRoot, value || "Update")
                  this.commitMassageInputRef.current.value = ""
                }}
              >
                Commit
              </button>
              <input
                ref={this.commitMassageInputRef}
                placeholder="Commit massage here ..."
              />
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
                  <button
                    onClick={() => {
                      this.props.addToStage(projectRoot, filepath)
                    }}
                  >
                    add to stage
                  </button>
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
                      <button
                        onClick={() => {
                          this.props.addToStage(projectRoot, filepath)
                        }}
                      >
                        add to stage{" "}
                      </button>
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
      const repositoryStatus = await getProjectGitStatus(projectRoot)
      const history = await getLogInRepository(projectRoot, {
        ref: repositoryStatus.currentBranch
      })
      this.setState({ repositoryStatus, history })
    }
  }
)

const Container = styled.div`
  padding: 10px;
`
