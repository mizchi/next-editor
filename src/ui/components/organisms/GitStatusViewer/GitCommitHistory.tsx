import React from "react"
import FaMinusSquare from "react-icons/fa/minus-square-o"
import FaPlusSquare from "react-icons/fa/plus-square-o"
import { CommitDescription } from "../../../../domain/types"

export class GitCommitHistory extends React.Component<
  {
    history: CommitDescription[]
  },
  { opened: boolean }
> {
  state = {
    opened: true
  }
  render() {
    const { history } = this.props
    return (
      <div>
        <fieldset>
          <legend
            style={{ userSelect: "none", cursor: "pointer" }}
            onClick={() => this.setState({ opened: !this.state.opened })}
          >
            {this.state.opened ? <FaMinusSquare /> : <FaPlusSquare />}
            History
          </legend>
          {this.state.opened && (
            <>
              <div style={{ fontFamily: "Inconsolata, monospace" }}>
                {history.map(descrption => {
                  const name =
                    (descrption.committer && descrption.committer.name) ||
                    "<anonymous>"
                  const message =
                    (descrption.error && `(${descrption.error.message})`) ||
                    descrption.message
                  return (
                    <div key={descrption.oid}>
                      {descrption.oid.slice(0, 7)} | {name} | {message}
                    </div>
                  )
                })}
              </div>
            </>
          )}
        </fieldset>
      </div>
    )
  }
}
