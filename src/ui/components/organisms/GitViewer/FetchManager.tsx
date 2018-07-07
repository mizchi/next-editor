import fs from "fs"
import * as git from "isomorphic-git"
import React from "react"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

type Props = { projectRoot: string; remotes: string[] }

export class FetchManager extends React.Component<
  Props,
  { selectedRemote: string }
> {
  constructor(props: Props) {
    super(props)
    this.state = {
      selectedRemote: props.remotes[0]
    }
  }
  render() {
    const { projectRoot, remotes } = this.props
    const { selectedRemote } = this.state

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
        {remotes.length > 0 && (
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
                    type: "error",
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
