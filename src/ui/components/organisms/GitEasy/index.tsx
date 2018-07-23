import React from "react"
import { connector } from "../../../actionCreators"
import { CommandWithInput } from "../../atoms/CommandWithInput"
import { Content, Pane } from "../../utils/Pane"
import { GitBriefHistory } from "../GitBriefHistory"

// This is example reference
export const GitEasy = connector(
  state => {
    return {
      currentBranch: state.git.currentBranch,
      staging: state.git.staging
    }
  },
  actions => {
    return {
      commitAll: actions.git.commitAll
    }
  }
)(props => {
  const { staging } = props

  if (!staging) {
    return <Pane>Loading...</Pane>
  } else {
    const modified = Object.keys(staging)
      .map((filepath: string) => {
        return { filepath, status: staging[filepath] }
      })
      .filter((a: any) => a.status !== "unmodified")
    return (
      <Pane>
        <Content>
          <fieldset>
            <legend>Changes</legend>
            <CommandWithInput
              description="Commit all"
              placeholder="Commit message..."
              validate={() => modified.length > 0}
              onExec={message => {
                props.commitAll({ message: message || "Update" })
              }}
            />
            <hr />

            {modified.length > 0 ? (
              <div>
                {modified.map(({ filepath, status }) => {
                  return (
                    <div key={filepath}>
                      {filepath}({status})
                    </div>
                  )
                })}
              </div>
            ) : (
              <div>No changes</div>
            )}
          </fieldset>

          <GitBriefHistory />
        </Content>
      </Pane>
    )
  }
})
