import { Button } from "@blueprintjs/core"
import React from "react"
import { isFastForward } from "../../../../domain/git"
import { ConfigState } from "../../../reducers/config"
import { CommandWithInput } from "../../atoms/CommandWithInput"
import { CommandWithSelect } from "../../atoms/CommandWithSelect"
import { FetchManager } from "./FetchManager"

export class BranchController extends React.Component<
  {
    config: ConfigState
    projectRoot: string
    currentBranch: string
    branches: string[]
    remotes: string[]
    remoteBranches: string[]
    onChangeBranch: (branchName: string) => void
    onClickCreateBranch: (branchName: string) => void
    onClickRemoveBranch: (branchName: string) => void
    onClickGitPush: (branchName: string) => void
    onClickOpenConfig: () => void
    onClickMerge: (ref1: string, ref2: string) => void
  },
  { opened: boolean }
> {
  state = {
    opened: true
  }
  render() {
    const {
      config,
      currentBranch,
      branches,
      remotes,
      remoteBranches,
      onChangeBranch,
      onClickCreateBranch,
      onClickGitPush,
      onClickRemoveBranch,
      projectRoot
    } = this.props
    return (
      <fieldset>
        <legend style={{ userSelect: "none", cursor: "pointer" }}>
          <Button
            minimal
            icon={this.state.opened ? "minus" : "plus"}
            onClick={() => this.setState({ opened: !this.state.opened })}
          />
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
              <CommandWithSelect
                key={currentBranch}
                description="Delete branch"
                tooltip={value => `git branch -d ${value}`}
                initialValue={""}
                validate={value => {
                  return value.length > 0 && value !== currentBranch
                }}
                options={[""].concat(branches.filter(b => b !== "master"))}
                onExec={value => {
                  onClickRemoveBranch(value)
                }}
              />
            </div>
            <div>
              <CommandWithInput
                description="Checkout new branch"
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
                key={currentBranch}
                currentBranch={currentBranch}
                remoteBranches={remoteBranches}
                projectRoot={projectRoot}
                branches={branches}
                remotes={remotes}
                onMerge={async (ref1, ref2) => {
                  this.props.onClickMerge(ref1, ref2)
                }}
              />
            </div>
            {remotes.length > 0 && (
              <>
                <hr />
                {!config.githubApiToken && (
                  <button onClick={() => this.props.onClickOpenConfig()}>
                    Set github API Token
                  </button>
                )}
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

class MergeManager extends React.Component<
  {
    projectRoot: string
    branches: string[]
    remotes: string[]
    currentBranch: string
    remoteBranches: string[]
    onMerge: (ref1: string, ref2: string) => void
  },
  {
    theirs: string
    mergeable: boolean
  }
> {
  constructor(props: any) {
    super(props)
    this.state = {
      theirs: this.props.currentBranch,
      mergeable: false
    }
  }
  render() {
    const mergeBranches = [...this.props.branches, ...this.props.remoteBranches]
    return (
      <div>
        <div>
          Merge ours: [{this.props.currentBranch}] : theirs:
          <select
            value={this.state.theirs}
            onChange={async e => {
              const theirs = e.target.value
              this.setState({ theirs, mergeable: false })
              const ret = await isFastForward(
                this.props.projectRoot,
                this.props.currentBranch,
                theirs
              )
              this.setState({ mergeable: ret.fastForward && !ret.self })
            }}
          >
            {mergeBranches.map(b => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
          &nbsp;
          <button
            disabled={!this.state.mergeable}
            onClick={async () => {
              this.props.onMerge(this.props.currentBranch, this.state.theirs)
            }}
          >
            exec
          </button>
          {!this.state.mergeable && <span>(fast forward only)</span>}
        </div>
      </div>
    )
  }
}
