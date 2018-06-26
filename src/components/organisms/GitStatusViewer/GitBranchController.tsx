import React from "react"
import { CommandWithInput } from "../../atoms/CommandWithInput"
import { CommandWithSelect } from "../../atoms/CommandWithSelect"
import { GitPushManager } from "./GitPushManager"

export class GitBranchController extends React.PureComponent<{
  projectRoot: string
  currentBranch: string
  branches: string[]
  onChangeBranch: (branchName: string) => void
  onClickCreateBranch: (branchName: string) => void
}> {
  render() {
    const {
      currentBranch,
      branches,
      onChangeBranch,
      onClickCreateBranch,
      projectRoot
    } = this.props
    return (
      <fieldset>
        <legend>Branch</legend>
        <div>
          <CommandWithSelect
            description="Checkout"
            initialValue={currentBranch}
            options={branches}
            onExec={value => {
              onChangeBranch(value)
            }}
          />
        </div>
        <div>
          <CommandWithInput
            description="Create new branch"
            onExec={value => {
              onClickCreateBranch(value)
            }}
          />
        </div>
        <GitPushManager projectRoot={projectRoot} />
      </fieldset>
    )
  }
}
