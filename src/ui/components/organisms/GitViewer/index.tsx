import React from "react";
import { toast, ToastContainer } from "react-toastify";
import { lifecycle } from "recompose";
import { connector } from "../../../reducers";
import { Padding } from "../../utils/LayoutUtils";
import { BranchController } from "./BranchController";
import { History } from "./History";
import { Staging } from "./Staging";

export const GitViewer = connector(
  state => {
    return {
      git: state.git,
      projectRoot: state.repository.currentProjectRoot,
      touchCounter: state.repository.touchCounter
    }
  },
  actions => {
    return {
      addToStage: actions.repository.addToStage,
      pushCurrentBranchToOrigin: actions.repository.pushCurrentBranchToOrigin,
      createBranch: actions.repository.createBranch,
      checkoutToOtherBranch: actions.repository.checkoutToOtherBranch,
      commitStagedChanges: actions.repository.commitStagedChanges,
      // commitUnstagedChanges: actions.repository.commitUnstagedChanges,
      removeFileFromGit: actions.repository.removeFileFromGit,
      initialize: actions.git.initialize
    }
  },
  lifecycle({
    componentDidMount() {
      const p: any = this.props
      if (p.git.type === "loading") {
        p.initialize(p.projectRoot)
      }
    }
  })
)(props => {
  const { projectRoot, git } = props
  if (git.type === "loading") {
    return <span>[Git] initialize...</span>
  } else {
    const { currentBranch, branches, history, staging, stagingLoading } = git
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
              // TODO: Update
            }}
            onClickCreateBranch={async (newBranchName: string) => {
              await props.createBranch(projectRoot, newBranchName)
              // TODO: Update
            }}
          />
          <History history={history} />
          <div style={{ flex: 1 }}>
            {staging && (
              <Staging
                staging={staging}
                loading={stagingLoading}
                onClickReload={() => {
                  props.initialize(props.projectRoot)
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
                  alert('not implemented yet')
                  // TODO
                  // const unstagedChanges: GitFileStatus[] = staging.modified.map(
                  //   u => {
                  //     const x = staging.raw.find(change => change.relpath === u)
                  //     return x
                  //   }
                  // ) as any
                  // props.commitUnstagedChanges(
                  //   projectRoot,
                  //   unstagedChanges,
                  //   message || "Update"
                  // )
                }}
              />
            )}
          </div>
        </div>
      </Padding>
    )
  }
})
