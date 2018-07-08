import fs from "fs"
import * as git from "isomorphic-git"
import React from "react"
import { toast, ToastContainer } from "react-toastify"
import { listOriginBranches } from "../../../../domain/git/queries/listBranches"

export class MergeManager extends React.Component<{
  projectRoot: string
  branches: string[]
}> {
  state = {
    ours: "master",
    theirs: "master",
    originBranches: []
  }
  async componentDidMount() {
    const { projectRoot } = this.props
    const originBranches = await listOriginBranches(projectRoot)
    this.setState({ originBranches })
  }

  render() {
    const mergeableBranches: string[] = this.props.branches.concat(
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
            {this.props.branches.map(b => (
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
