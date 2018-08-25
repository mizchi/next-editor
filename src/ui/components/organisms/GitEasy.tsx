import { Button } from "@blueprintjs/core"
import React from "react"
import { connector } from "../../actionCreators"
import { Content, Pane } from "../utils/Pane"
import { GitBriefHistory } from "./GitBriefHistory"

// This is example reference
export const GitEasy = connector(
  state => {
    return {
      projectRoot: state.repository.currentProjectRoot,
      currentBranch: state.git.currentBranch,
      staging: state.git.staging
    }
  },
  actions => {
    return {
      commitAll: actions.git.commitAll,
      initializeGitStatus: actions.editor.initializeGitStatus
    }
  }
)(function GitEasyImpl(props) {
  const { staging } = props

  if (!staging) {
    return <Pane>Loading...</Pane>
  } else {
    const stagingList = Object.keys(staging).map((filepath: string) => {
      return { filepath, status: staging[filepath] }
    })

    const modified = stagingList.filter(
      (a: any) => !["unmodified", "ignored"].includes(a.status)
    )

    const hasError = stagingList.some((a: any) => a.status === "__error__")

    return (
      <Pane>
        <Content>
          <fieldset>
            <legend>Changes</legend>
            <Button
              text="Commit All"
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
            {hasError && (
              <Button
                text="Reload git"
                onClick={() => {
                  props.initializeGitStatus(props.projectRoot)
                }}
              />
            )}
          </fieldset>

          <GitBriefHistory />
        </Content>
      </Pane>
    )
  }
})
