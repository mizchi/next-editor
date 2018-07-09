import React from "react"
import FaMinusSquare from "react-icons/fa/minus-square-o"
import FaPlusSquare from "react-icons/fa/plus-square-o"
import { CommandWithInput } from "../../atoms/CommandWithInput"
import { CommandWithSelect } from "../../atoms/CommandWithSelect"
import { FetchManager } from "./FetchManager"
import { MergeManager } from "./MergeManager"

export class BranchController extends React.Component<
  {
    projectRoot: string
    currentBranch: string
    branches: string[]
    remotes: string[]
    remoteBranches: string[]
    onChangeBranch: (branchName: string) => void
    onClickCreateBranch: (branchName: string) => void
    onClickGitPush: (branchName: string) => void
  },
  { opened: boolean }
> {
  state = {
    opened: true
  }
  render() {
    const {
      currentBranch,
      branches,
      remotes,
      remoteBranches,
      onChangeBranch,
      onClickCreateBranch,
      onClickGitPush,
      projectRoot
    } = this.props
    return (
      <fieldset>
        <legend
          style={{ userSelect: "none", cursor: "pointer" }}
          onClick={() => this.setState({ opened: !this.state.opened })}
        >
          {this.state.opened ? <FaMinusSquare /> : <FaPlusSquare />}
          Branch
        </legend>
        {this.state.opened && (
          <>
            <div>
              <CommandWithSelect
                key={currentBranch}
                description="Checkout"
                tooltip={value => `git checkout ${value}`}
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
                description="Checkout new branch"
                tooltip={value => `git checkout -b ${value}`}
                validate={value =>
                  value.length > 0 && !branches.includes(value)
                }
                onExec={value => {
                  onClickCreateBranch(value)
                }}
              />
            </div>
            <div>
              <MergeManager
                remoteBranches={remoteBranches}
                projectRoot={projectRoot}
                branches={branches}
                remotes={remotes}
              />
            </div>
            {remotes.length > 0 && (
              <>
                <hr />
                <div>
                  <FetchManager projectRoot={projectRoot} remotes={remotes} />
                </div>
                <div>
                  <CommandWithSelect
                    key={currentBranch}
                    description="Push to origin"
                    options={branches}
                    initialValue={currentBranch}
                    tooltip={value => `git push origin ${value}`}
                    // validate={value => value.length > 0 && !branches.includes(value)}
                    onExec={value => {
                      onClickGitPush(value)
                    }}
                  />
                </div>
              </>
            )}
          </>
        )}
      </fieldset>
    )
  }
}
