import fs from "fs"
import * as git from "isomorphic-git"
import React from "react"

export class GitFetchManager extends React.Component<{ projectRoot: string }> {
  render() {
    return (
      <div>
        Fetch from origin &nbsp;
        <button
          onClick={async () => {
            git.fetch({
              fs,
              dir: this.props.projectRoot,
              remote: "origin"
            })
            console.log("fetch done")
          }}
        >
          exec
        </button>
      </div>
    )
  }
}
