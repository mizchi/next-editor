import { Button, NumericInput } from "@blueprintjs/core"
import path from "path"
import React from "react"
import { cloneRepository } from "../../../../domain/git"

export class CloneProjectModalContent extends React.Component<
  {
    githubProxy: string
    onCancel: () => void
    onConfirm: (dirname: string) => void
  },
  {
    value: string
    cloningProgress: string
    cloningMessage: string
    onCloning: boolean
  }
> {
  state = {
    opened: false,
    value: "",
    cloningMessage: "",
    cloningProgress: "",
    onCloning: false
  }
  render() {
    const { githubProxy, onCancel, onConfirm } = this.props
    const { onCloning, cloningMessage, cloningProgress } = this.state
    return (
      <div>
        <h2>Clone from GitHub</h2>
        <div>
          <label>
            Git Url: HTTPS only
            <input
              className="bp3-input"
              style={{ width: "100%" }}
              placeholder="https://github.com/<username>/<repo>"
              spellCheck={false}
              value={this.state.value}
              onChange={event => this.setState({ value: event.target.value })}
            />
          </label>

          <label>
            SingleBranch:
            <input type="checkbox" checked={true} disabled={true} />
          </label>
          <br />
          <label>
            Clone Depth:
            <NumericInput value={1} disabled={true} />
          </label>

          <p>
            <span style={{ color: "red" }}>TODO: Unstable feature.</span>
            <br />
            NextEditor set a limit to&nbsp;
            <code style={{ background: "#eee", color: "#000", padding: 3 }}>
              git clone :url --depth 1 --single-branch master
            </code>
          </p>
        </div>

        <Button
          disabled={onCloning}
          onClick={async () => {
            // Rewrite with proxy path
            const repoPath = this.state.value.replace("https://github.com/", "")
            const clonePath = githubProxy + repoPath
            const [, repoName] = repoPath.split("/")
            const newProjectRoot = path.join("/", repoName)

            this.setState({ onCloning: true })

            // TODO: It's a smart UI to show progress easily
            await cloneRepository(newProjectRoot, clonePath, {
              singleBranch: true,
              depth: 1,
              onProgress: pe => {
                console.log("[clone/progress]", pe)
              },
              onMessage: message => {
                this.setState({ cloningMessage: message })
                console.log("[clone/message]", message)
              }
            })
            this.setState({ onCloning: false })
            onConfirm(newProjectRoot)
          }}
          text="Clone"
        />
        {onCloning && (
          <div>
            <div>Cloning...</div>
            <p>{cloningMessage}</p>
            <p>{cloningProgress}</p>
          </div>
        )}

        <hr />
        <div>
          <Button onClick={onCancel} text="Cancel" />
        </div>
      </div>
    )
  }
}
