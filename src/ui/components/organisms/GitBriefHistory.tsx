import { Button } from "@blueprintjs/core"
import format from "date-fns/format"
import React from "react"
import { CommitDescription } from "../../../domain/types"
import { connector } from "../../actionCreators"

export const GitBriefHistory = connector(
  state => {
    return {
      currentBranch: state.git.currentBranch,
      history: state.git.history
    }
  },
  _actions => {
    return {}
  }
)(function GitBriefHistoryImpl(props) {
  const { currentBranch, history } = props
  return <GitBriefHistoryContent branch={currentBranch} history={history} />
})

class GitBriefHistoryContent extends React.Component<
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
          <legend style={{ userSelect: "none", cursor: "pointer" }}>
            <Button
              minimal
              icon={this.state.opened ? "minus" : "plus"}
              onClick={() => this.setState({ opened: !this.state.opened })}
            />
            {/* {this.state.opened ? <Icon icon="minus" /> : <Icon icon="plus" />} */}
            History[
            {branch}]
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
