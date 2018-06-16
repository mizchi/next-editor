import React from "react"
import { Command } from "../../atoms/Command"

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
      branches,
      onChangeBranch,
      onClickCreateBranch
    } = this.props
    return (
      <>
        <div>
          git checkout
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
          <Command
            command="git branch $$"
            description="Create new branch"
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
