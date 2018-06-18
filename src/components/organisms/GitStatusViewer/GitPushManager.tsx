// TODO: Rewrite this file later
// This file is concept check to push github
import fs from "fs"
import * as git from "isomorphic-git"
import path from "path"
import React from "react"
import { writeFile } from "../../../domain/filesystem/commands/writeFile"

export class GitPushManager extends React.Component<
  { projectRoot: string },
  {
    endpoint: string
    result: string | null
    opened: boolean
  }
> {
  state = {
    opened: false,
    endpoint:
      "https://cors-buster-tbgktfqyku.now.sh/github.com/<username>/<repo>",
    result: null
  }
  render() {
    return (
      <div>
        <span>Git Push Manager (WIP)</span>
        <button onClick={() => this.setState({ opened: !this.state.opened })}>
          {this.state.opened ? "-" : "+"}
        </button>
        {this.state.opened && (
          <>
            <div>
              origin:
              <input
                style={{ width: "100%" }}
                value={this.state.endpoint}
                onChange={event =>
                  this.setState({ endpoint: event.target.value })
                }
              />
            </div>
            <button
              onClick={async () => {
                await writeFile(
                  path.join(this.props.projectRoot, ".git/config"),
                  `[remote "origin"]
  url = ${this.state.endpoint}
  fetch = +refs/heads/*:refs/remotes/origin/*`
                )
                const githubToken = window.localStorage.getItem("github-token")
                if (!githubToken) {
                  throw new Error("github token does not set")
                }
                const ret = await git.push({
                  fs,
                  dir: this.props.projectRoot,
                  remote: "origin",
                  ref: "master",
                  authUsername: githubToken,
                  authPassword: githubToken
                })
                this.setState({ result: ret.ok && "ok" })
              }}
            >
              git push origin master
            </button>
            {this.state.result || ""}
          </>
        )}
      </div>
    )
  }
}
