import React from "react"
import { connect } from "react-redux"
import styled from "styled-components"
import {
  CommitDescription,
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
            <GitLog history={history} />
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

export class GitBranchController extends React.PureComponent<{
  projectRoot: string
  currentBranch: string
  branches: string[]
  onChangeBranch: (branchName: string) => void
  onClickCreateBranch: (branchName: string) => void
}> {
  private newBranchInputRef: any = React.createRef()
  render() {
    const {
      currentBranch,
      projectRoot,
      branches,
      onChangeBranch,
      onClickCreateBranch
    } = this.props
    return (
      <>
        <div>
          Switch branch:
          <select
            value={currentBranch}
            onChange={ev => {
              onChangeBranch(ev.target.value)
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
          git branch <input ref={this.newBranchInputRef} />
          &nbsp;
          <button
            onClick={async () => {
              const newBranchName = this.newBranchInputRef.current.value
              this.newBranchInputRef.current.value = ""
              onClickCreateBranch(newBranchName)
            }}
          >
            create
          </button>
        </div>
      </>
    )
  }
}

function GitLog({ history }: { history: CommitDescription[] }) {
  return (
    <>
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
    </>
  )
}

export class GitCommitStatus extends React.PureComponent<{
  added: string[]
  staged: string[]
  modified: string[]
  untracked: string[]
  onClickGitAdd: (filepath: string) => void
  onClickGitCommit: (message: string) => void
}> {
  private commitMassageInputRef: any = React.createRef()
  render() {
    const {
      added,
      staged,
      modified,
      untracked,
      onClickGitAdd,
      onClickGitCommit
    } = this.props
    return (
      <div>
        <h3>staging</h3>
        <div>
          git commit -m &nbsp;
          <input
            ref={this.commitMassageInputRef}
            placeholder="Commit massage here ..."
          />
          &nbsp;
          <button
            onClick={() => {
              const value = this.commitMassageInputRef.current.value
              this.commitMassageInputRef.current.value = ""

              onClickGitCommit(value)
            }}
          >
            Commit
          </button>
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
                  onClickGitAdd(filepath)
                }}
              >
                git add {filepath}
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
                      onClickGitAdd(filepath)
                    }}
                  >
                    git add {filepath}
                  </button>
                </div>
              )
            })}
            <hr />
          </>
        )}
      </div>
    )
  }
}

const Container = styled.div`
  padding: 10px;
`
