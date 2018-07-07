import fs from "fs"
import * as git from "isomorphic-git"
import React from "react"
import { toast, ToastContainer } from "react-toastify"
import {
  listBranches,
  listOriginBranches
} from "../../../../domain/git/queries/listBranches"

export class GitMergeManager extends React.Component<{ projectRoot: string }> {
  state = {
    ours: "master",
    theirs: "master",
    branches: [],
    originBranches: []
  }
  async componentDidMount() {
    const { projectRoot } = this.props
    const branches = await listBranches(projectRoot)
    const originBranches = await listOriginBranches(projectRoot)
    this.setState({ branches, originBranches })
  }

  render() {
    const mergeableBranches: string[] = this.state.branches.concat(
      (this.state.originBranches as any).map(
        (m: string) => `remotes/origin/${m}`
      )
    )
    return (
      <div>
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
        <div>
          Merge ours:
          <select
            value={this.state.ours}
            onChange={e => this.setState({ ours: e.target.value })}
          >
            {this.state.branches.map(b => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
          : theirs:
          <select
            value={this.state.theirs}
            onChange={e => this.setState({ theirs: e.target.value })}
          >
            {mergeableBranches.map(b => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
          &nbsp;
          <button
            // TODO: check mergeable
            disabled={this.state.theirs === this.state.ours}
            onClick={async () => {
              try {
                await git.merge({
                  fs,
                  dir: this.props.projectRoot,
                  ours: this.state.ours,
                  theirs: this.state.theirs
                })
                toast(`Merge success`, {
                  position: "top-right",
                  autoClose: 3000,
                  hideProgressBar: true,
                  pauseOnHover: true,
                  draggable: false
                })
              } catch (e) {
                toast(`Merge failed`, {
                  type: "error",
                  position: "top-right",
                  autoClose: 3000,
                  hideProgressBar: true,
                  pauseOnHover: true,
                  draggable: false
                })
              }
            }}
          >
            exec
          </button>
        </div>
      </div>
    )
  }
}
