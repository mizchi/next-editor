import React from "react"
import { Command } from "../../atoms/Command"

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
      onClickCreateBranch
    } = this.props
    return (
      <>
        <h2>Branch</h2>
        <div>
          <Command
            type="select"
            options={branches}
            initialValue={currentBranch}
            command="git checkout $$"
            description="Git Operation: switch to other branch"
            onExec={value => {
              onChangeBranch(value)
            }}
          />
        </div>
        <div>
          <Command
            command="git branch $$"
            description="Git Operation: create new branch"
            validate={value => value.length > 0}
            onExec={value => {
              onClickCreateBranch(value)
            }}
          />
        </div>
      </>
    )
  }
}
