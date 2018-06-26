import fs from "fs"
import * as git from "isomorphic-git"
import React from "react"
import {
  listBranches,
  listOriginBranches
} from "../../../domain/git/queries/listBranches"

export class GitFetchManager extends React.Component<{ projectRoot: string }> {
  state = {
    ours: "master",
    theirs: "remotes/origin/master",
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
        <div>
          Merge -&nbsp; ours:
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
          <button
            onClick={async () => {
              await git.merge({
                fs,
                dir: this.props.projectRoot,
                ours: this.state.ours,
                theirs: this.state.theirs
              })

              console.log("merge seccess")
            }}
          >
            Exec
          </button>
        </div>
      </div>
    )
  }
}
