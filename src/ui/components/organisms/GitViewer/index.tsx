import React from "react"
import { lifecycle } from "recompose"
import { connector } from "../../../actionCreators"
import { GitBriefHistory } from "../GitBriefHistory"
import { BranchController } from "./BranchController"
import { buildGroupedGitStatus } from "./helpers"
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
      resetIndex: actions.editor.resetIndex,
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
      stagingLoading,
      remotes,
      remoteBranches,
      statusMatrix
    } = git
    return (
      <div key={projectRoot} style={{ width: "100%", boxSizing: "border-box" }}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div>
            {projectRoot} [{currentBranch}]
          </div>
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
              // TODO Confirm
              await props.moveToBranch({ projectRoot, branch: branchName })
              // if (statusMatrix) {
              //   const data = buildGroupedGitStatus(staging)
              //   if (data.hasStaged || data.hasModified) {
              //     const checked = window.confirm(
              //       `You have staged or modified changes.Checkout really?`
              //     )
              //     if (checked) {
              //       await props.moveToBranch({
              //         projectRoot,
              //         branch: branchName
              //       })
              //     }
              //   } else {
              //     await props.moveToBranch({ projectRoot, branch: branchName })
              //   }
              // }
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
          <div style={{ flex: 1 }}>
            {statusMatrix && (
              <Staging
                statusMatrix={statusMatrix}
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
                onClickGitReset={(relpath: string) => {
                  props.resetIndex({ projectRoot, relpath })
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
        <GitBriefHistory />
      </div>
    )
  }
})
