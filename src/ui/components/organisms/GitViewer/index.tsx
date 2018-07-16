import React from "react"
import { toast, ToastContainer } from "react-toastify"
import { lifecycle } from "recompose"
import { connector } from "../../../reducers"
import { BranchController } from "./BranchController"
import { History } from "./History"
import { Staging } from "./Staging"

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
      checkoutNewBranch: actions.git.checkoutNewBranch,
      moveToBranch: actions.git.moveToBranch,
      commitStagedChanges: actions.git.commitStagedChanges,
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
    const {
      currentBranch,
      branches,
      history,
      staging,
      stagingLoading,
      remotes,
      remoteBranches
    } = git
    return (
      <div key={projectRoot} style={{ width: "100%", padding: "10px" }}>
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
            remoteBranches={remoteBranches}
            projectRoot={projectRoot}
            currentBranch={currentBranch}
            branches={branches}
            remotes={remotes}
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
              await props.moveToBranch({ projectRoot, branch: branchName })
              // TODO: Update
            }}
            onClickCreateBranch={async (newBranchName: string) => {
              await props.checkoutNewBranch({
                projectRoot,
                branch: newBranchName
              })
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
                onClickGitAdd={(relpath: string) => {
                  props.addToStage({ projectRoot, relpath })
                }}
                onClickGitRemove={(relpath: string) => {
                  props.removeFileFromGit({ projectRoot, relpath })
                }}
                onClickGitCommit={(message: string) => {
                  props.commitStagedChanges({
                    projectRoot,
                    message: message || "Update"
                  })
                }}
                onClickGitCommitUnstaged={(message: string) => {
                  alert("not implemented yet")
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
      </div>
    )
  }
})
