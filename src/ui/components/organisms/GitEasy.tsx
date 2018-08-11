import { Button } from "@blueprintjs/core"
import React from "react"
import { connector } from "../../actionCreators"
import { Content, Pane } from "../utils/Pane"
import { GitBriefHistory } from "./GitBriefHistory"

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
)(function GitEasyImpl(props) {
  const { staging } = props

  if (!staging) {
    return <Pane>Loading...</Pane>
  } else {
    const modified = Object.keys(staging)
      .map((filepath: string) => {
        return { filepath, status: staging[filepath] }
      })
      .filter((a: any) => !["unmodified", "ignored"].includes(a.status))
    return (
      <Pane>
        <Content>
          <fieldset>
            <legend>Changes</legend>
            <Button
              text="Commit All"
              placeholder="Update"
              disabled={modified.length === 0}
              onClick={() => {
                props.commitAll({ message: "Update" })
              }}
              data-testid="commit-all-button"
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
