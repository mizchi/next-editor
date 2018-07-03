import fs from "fs"
import * as git from "isomorphic-git"
import React from "react"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { getRemotes } from "../../../../domain/git/queries/getRemotes"

export class GitFetchManager extends React.Component<
  { projectRoot: string },
  { remotes: string[]; selectedRemote: any }
> {
  state = {
    remotes: [],
    selectedRemote: null
  }
  async componentDidMount() {
    const remotes = await getRemotes(this.props.projectRoot)
    this.setState({ remotes, selectedRemote: remotes[0] })
  }
  render() {
    const { projectRoot } = this.props
    const { selectedRemote, remotes } = this.state

    return (
      <div>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          draggablePercent={60}
          closeOnClick
          rtl={false}
          pauseOnVisibilityChange
          draggable
          pauseOnHover
        />
        {remotes.length > 0 &&
          typeof selectedRemote === "string" && (
            <>
              Fetch from&nbsp;
              <select
                value={selectedRemote}
                onChange={ev =>
                  this.setState({ selectedRemote: ev.target.value })
                }
              >
                {remotes.map(remote => (
                  <option key={remote} value={remote}>
                    {remote}
                  </option>
                ))}
              </select>
              <button
                onClick={async () => {
                  try {
                    ;(git.fetch as any)({
                      fs,
                      dir: projectRoot,
                      remote: this.state.selectedRemote
                    })
                    // TODO: show updated branch
                    toast(`Fetch done: ${this.state.selectedRemote}`, {
                      position: "top-right",
                      autoClose: 3000,
                      hideProgressBar: true,
                      pauseOnHover: true,
                      draggable: false
                    })
                  } catch (e) {
                    toast(`Fetch failed: ${this.state.selectedRemote}`, {
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
            </>
          )}
      </div>
    )
  }
}
