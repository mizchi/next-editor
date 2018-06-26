import React from "react"
import { CommandWithInput } from "../../atoms/CommandWithInput"
import { CommandWithSelect } from "../../atoms/CommandWithSelect"
import { GitMergeManager } from "./GitMergeManager"

export class GitBranchController extends React.PureComponent<{
  projectRoot: string
  currentBranch: string
  branches: string[]
  onChangeBranch: (branchName: string) => void
  onClickCreateBranch: (branchName: string) => void
  onClickGitPush: (branchName: string) => void
}> {
  render() {
    const {
      currentBranch,
      branches,
      onChangeBranch,
      onClickCreateBranch,
      onClickGitPush,
      projectRoot
    } = this.props
    return (
      <fieldset>
        <legend>Branch</legend>
        <div>
          <CommandWithSelect
            description="Checkout"
            tooltip={value => `> git checkout ${value}`}
            validate={value => value !== currentBranch}
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
            tooltip={value => `> git branch ${value}`}
            validate={value => value.length > 0 && !branches.includes(value)}
            onExec={value => {
              onClickCreateBranch(value)
            }}
          />
        </div>
        <div>
          <CommandWithSelect
            key={currentBranch}
            description="Push branch to origin"
            options={branches}
            initialValue={currentBranch}
            tooltip={value => `> git push origin ${value}`}
            // validate={value => value.length > 0 && !branches.includes(value)}
            onExec={value => {
              onClickGitPush(value)
            }}
          />
        </div>
        <div>
          <GitMergeManager projectRoot={projectRoot} />
        </div>
      </fieldset>
    )
  }
}
