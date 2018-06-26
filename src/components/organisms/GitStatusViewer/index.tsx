import React from "react"
import { lifecycle } from "recompose"
import { connector } from "../../../reducers"
import { Padding } from "../../utils/LayoutUtils"
import { GitBranchController } from "./GitBranchController"
import { GitCommitHistory } from "./GitCommitHistory"
import { GitCommitStatus } from "./GitCommitStatus"
import { GitPushManager } from "./GitPushManager"

export const GitStatusViewer = connector(
  state => {
    return {
      gitRepositoryStatus: state.repository.gitRepositoryStatus,
      gitStatusLoading: state.repository.gitStatusLoading,
      gitTouchCounter: state.repository.gitTouchCounter,
      projectRoot: state.repository.currentProjectRoot,
      fsTouchCounter: state.repository.fsTouchCounter
    }
  },
  actions => {
    return {
      addToStage: actions.repository.addToStage,
      createBranch: actions.repository.createBranch,
      checkoutToOtherBranch: actions.repository.checkoutToOtherBranch,
      commitStagedChanges: actions.repository.commitStagedChanges,
      commitUnstagedChanges: actions.repository.commitUnstagedChanges,
      updateGitStatus: actions.repository.updateGitStatus,
      removeFileFromGit: actions.repository.removeFileFromGit
    }
  },
  lifecycle({
    componentDidMount() {
      const p: any = this.props
      p.updateGitStatus(p.projectRoot)
    },
    componentDidUpdate(prev: any) {
      const p: any = this.props
      if (p.fsTouchCounter !== prev.fsTouchCounter) {
        p.updateGitStatus(p.projectRoot)
      }
    }
  })
)(props => {
  const { projectRoot, gitRepositoryStatus, gitStatusLoading } = props

  if (gitRepositoryStatus == null) {
    return <span>Loading</span>
  } else {
    const { currentBranch, branches, history } = gitRepositoryStatus
    const { untracked } = gitRepositoryStatus
    const { staged, unstaged, rawStatusList } = gitRepositoryStatus
    const stagedChanges: any = staged.map(s => {
      return rawStatusList.find(change => change.relpath === s)
    })
    const unstagedChanges: any = unstaged.map(u => {
      const x = rawStatusList.find(change => change.relpath === u)
      if (x) {
        return x
      } else {
        // TODO: Git add come here in case of untrack => add
        console.error("error here by untrack", u)
      }
    })
    return (
      <Padding value={10} key={projectRoot}>
        <h2>Git Browser</h2>
        <div>
          {projectRoot} [{currentBranch}]
          <button onClick={() => props.updateGitStatus(props.projectRoot)}>
            Reload status
          </button>
        </div>
        <GitPushManager projectRoot={projectRoot} />
        <GitBranchController
          projectRoot={projectRoot}
          currentBranch={currentBranch}
          branches={branches}
          onChangeBranch={async (branchName: string) => {
            await props.checkoutToOtherBranch(projectRoot, branchName)
            props.updateGitStatus(props.projectRoot)
          }}
          onClickCreateBranch={async (newBranchName: string) => {
            await props.createBranch(projectRoot, newBranchName)
            props.updateGitStatus(props.projectRoot)
          }}
        />
        <GitCommitStatus
          loading={gitStatusLoading}
          stagedChanges={stagedChanges}
          unstagedChanges={unstagedChanges}
          untracked={untracked}
          onClickGitAdd={(filepath: string) => {
            props.addToStage(projectRoot, filepath)
          }}
          onClickGitRemove={(filepath: string) => {
            props.removeFileFromGit(projectRoot, filepath)
          }}
          onClickGitCommit={(message: string) => {
            props.commitStagedChanges(projectRoot, message || "Update")
          }}
          onClickGitCommitUnstaged={(message: string) => {
            props.commitUnstagedChanges(
              projectRoot,
              unstagedChanges,
              message || "Update"
            )
          }}
        />
        <GitCommitHistory history={history} />
      </Padding>
    )
  }
})
