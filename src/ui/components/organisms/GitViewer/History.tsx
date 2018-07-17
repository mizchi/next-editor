import format from "date-fns/format"
import React from "react"
import FaMinusSquare from "react-icons/fa/minus-square-o"
import FaPlusSquare from "react-icons/fa/plus-square-o"
import { CommitDescription } from "../../../../domain/types"

export class History extends React.Component<
  {
    branch: string
    history: CommitDescription[]
  },
  { opened: boolean }
> {
  state = {
    opened: true
  }
  render() {
    const { history, branch } = this.props
    return (
      <div>
        <fieldset>
          <legend
            style={{ userSelect: "none", cursor: "pointer" }}
            onClick={() => this.setState({ opened: !this.state.opened })}
          >
            {this.state.opened ? <FaMinusSquare /> : <FaPlusSquare />}
            History[{branch}]
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
                  const formatted = descrption.author
                    ? format(descrption.author.timestamp * 1000, "MM/DD HH:mm")
                    : "<none>"
                  return (
                    <div key={descrption.oid}>
                      {descrption.oid.slice(0, 7)} | {formatted} | {name} |{" "}
                      {message}
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
