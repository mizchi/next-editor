import React from "react"
import { toast, ToastContainer } from "react-toastify"
import { lifecycle } from "recompose"
import { connector } from "../../../reducers"
import { Padding } from "../../utils/LayoutUtils"
import { BranchController } from "./BranchController"
import { History } from "./History"
import { GitCommitStatus } from "./Staging"

export const GitViewer = connector(
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
      pushCurrentBranchToOrigin: actions.repository.pushCurrentBranchToOrigin,
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
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div>
            {projectRoot} [{currentBranch}]
          </div>
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            draggablePercent={60}
            closeOnClick
            rtl={false}
            pauseOnVisibilityChange
            draggable
            pauseOnHover
          />
          <BranchController
            projectRoot={projectRoot}
            currentBranch={currentBranch}
            branches={branches}
            onClickGitPush={async branchName => {
              try {
                await props.pushCurrentBranchToOrigin(projectRoot, branchName)
                toast(`Push success`, {
                  position: "top-right",
                  autoClose: 3000,
                  hideProgressBar: true,
                  pauseOnHover: true,
                  draggable: false
                })
              } catch (e) {
                toast(`Merge success`, {
                  type: "error",
                  position: "top-right",
                  autoClose: 3000,
                  hideProgressBar: true,
                  pauseOnHover: true,
                  draggable: false
                })
              }
            }}
            onChangeBranch={async (branchName: string) => {
              await props.checkoutToOtherBranch(projectRoot, branchName)
              props.updateGitStatus(props.projectRoot)
            }}
            onClickCreateBranch={async (newBranchName: string) => {
              await props.createBranch(projectRoot, newBranchName)
            }}
          />
          <History history={history} />
          <div style={{ flex: 1 }}>
            <GitCommitStatus
              loading={gitStatusLoading}
              stagedChanges={stagedChanges}
              unstagedChanges={unstagedChanges}
              untracked={untracked}
              onClickReload={() => {
                props.updateGitStatus(props.projectRoot)
              }}
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
          </div>
        </div>
      </Padding>
    )
  }
})
