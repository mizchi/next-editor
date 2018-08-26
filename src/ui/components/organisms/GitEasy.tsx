import { Button } from "@blueprintjs/core"
import React from "react"
import * as Parser from "../../../domain/git/queries/parseStatusMatrix"
import { connector } from "../../actionCreators"
import { GitBriefHistory } from "./GitBriefHistory"

// This is example reference
export const GitEasy = connector(
  state => {
    return {
      projectRoot: state.repository.currentProjectRoot,
      currentBranch: state.git.currentBranch,
      statusMatrix: state.git.statusMatrix
    }
  },
  actions => {
    return {
      commitAll: actions.git.commitAll,
      initializeGitStatus: actions.editor.initializeGitStatus
    }
  }
)(props => {
  if (props.statusMatrix == null) {
    return <span>Loading</span>
  } else {
    console.log("xxx")
    const removable = Parser.getRemovableFilenames(props.statusMatrix)
    const modified = Parser.getModifiedFilenames(props.statusMatrix).filter(
      a => !removable.includes(a)
    )

    const hasChanges = modified.length > 0 || removable.length > 0

    return (
      <div>
        <h1>Changes</h1>
        <Button
          text="Commit All"
          disabled={!hasChanges}
          onClick={() => {
            props.commitAll({ message: "Update" })
          }}
          data-testid="commit-all-button"
        />
        <Button
          text="Reload git"
          onClick={() => {
            props.initializeGitStatus(props.projectRoot)
          }}
        />

        {!hasChanges && <p>No Changes</p>}
        {hasChanges && (
          <>
            <div>
              {modified.map(filepath => {
                return (
                  <div key={filepath}>
                    {filepath}
                    (modified)
                  </div>
                )
              })}
            </div>
            <div>
              {removable.map(filepath => {
                return (
                  <div key={filepath}>
                    {filepath}
                    (deleted)
                  </div>
                )
              })}
            </div>
          </>
        )}

        <GitBriefHistory />
      </div>
    )
  }
})
