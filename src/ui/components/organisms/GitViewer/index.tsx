import React from "react"
import { ToastContainer } from "react-toastify"
import { lifecycle } from "recompose"
import { connector } from "../../../actions"
import { BranchController } from "./BranchController"
import { buildGroupedGitStatus } from "./helpers"
import { History } from "./History"
import { Staging } from "./Staging"

export const GitViewer = connector(
  state => {
    return {
      git: state.git,
      config: state.config,
      projectRoot: state.repository.currentProjectRoot,
      touchCounter: state.repository.touchCounter
    }
  },
  actions => {
    return {
      removeBranch: actions.git.removeBranch,
      mergeBranches: actions.git.mergeBranches,
      pushScene: actions.app.pushScene,
      addToStage: actions.editor.addToStage,
      pushCurrentBranchToOrigin: actions.editor.pushCurrentBranchToOrigin,
      checkoutNewBranch: actions.git.checkoutNewBranch,
      moveToBranch: actions.editor.moveToBranch,
      commitStagedChanges: actions.git.commitStagedChanges,
      removeFileFromGit: actions.editor.removeFileFromGit,
      initializeGitStatus: actions.editor.initializeGitStatus
    }
  },
  lifecycle({
    componentDidMount() {
      const p: any = this.props
      if (p.git.type === "loading") {
        p.initializeGitStatus(p.projectRoot)
      }
    }
  })
)(props => {
  const { projectRoot, git, config } = props
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
            config={config}
            remoteBranches={remoteBranches}
            projectRoot={projectRoot}
            currentBranch={currentBranch}
            branches={branches}
            remotes={remotes}
            onClickMerge={async (ref1, ref2) => {
              props.mergeBranches({ projectRoot, ref1, ref2 })
            }}
            onClickRemoveBranch={async branch => {
              props.removeBranch({ projectRoot, branch })
            }}
            onClickGitPush={async branchName => {
              await props.pushCurrentBranchToOrigin(projectRoot, branchName)
            }}
            onChangeBranch={async (branchName: string) => {
              if (staging) {
                const data = buildGroupedGitStatus(staging)
                if (data.hasStaged || data.hasModified) {
                  const checked = window.confirm(
                    `You have staged or modified changes.Checkout really?`
                  )
                  if (checked) {
                    await props.moveToBranch({
                      projectRoot,
                      branch: branchName
                    })
                  }
                } else {
                  await props.moveToBranch({ projectRoot, branch: branchName })
                }
              }
            }}
            onClickCreateBranch={async (newBranchName: string) => {
              await props.checkoutNewBranch({
                projectRoot,
                branch: newBranchName
              })
            }}
            onClickOpenConfig={() => {
              props.pushScene({ nextScene: "config" })
            }}
          />
          <History branch={currentBranch} history={history} />
          <div style={{ flex: 1 }}>
            {staging && (
              <Staging
                staging={staging}
                loading={stagingLoading}
                config={config}
                onClickReload={() => {
                  props.initializeGitStatus(props.projectRoot)
                }}
                onClickOpenConfig={() => {
                  props.pushScene({ nextScene: "config" })
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
              />
            )}
          </div>
        </div>
      </div>
    )
  }
})
