import React from "react"
import styled from "styled-components"
import { Command } from "../../atoms/Command"

type Props = { initialOpen: boolean; children: any }
type State = {
  opened: boolean
}

export class GitCommitStatus extends React.PureComponent<{
  added: string[]
  staged: string[]
  modified: string[]
  untracked: string[]
  removed: string[]
  removedInFS: string[]
  onClickGitAdd: (filepath: string) => void
  onClickGitRemove: (filepath: string) => void
  onClickGitCommit: (message: string) => void
}> {
  render() {
    const {
      added,
      staged,
      modified,
      untracked,
      removed,
      removedInFS,
      onClickGitAdd,
      onClickGitCommit,
      onClickGitRemove
    } = this.props
    const hasStagedChanges =
      added.length > 0 || staged.length > 0 || removed.length > 0
    const hasChanges =
      added.length > 0 ||
      staged.length > 0 ||
      modified.length > 0 ||
      removedInFS.length > 0 ||
      removed.length > 0 ||
      untracked.length > 0
    return (
      <div>
        <h2>Staging & Commit</h2>
        {!hasChanges && <>No changes</>}
        {hasStagedChanges && (
          <>
            <div>
              <Command
                description="Commit staged changes"
                command="git commit -m $$"
                onExec={value => {
                  onClickGitCommit(value)
                }}
              />
            </div>
            <StatusText>[staged]</StatusText>
            {added.map(filepath => {
              return <div key={filepath}>{filepath} (Added)</div>
            })}
            {staged.map(filepath => {
              return <div key={filepath}>{filepath} (Changed)</div>
            })}
          </>
        )}
        {modified.length > 0 && (
          <>
            <StatusText>[modified]</StatusText>
            {modified.map(filepath => {
              return (
                <div key={filepath}>
                  {filepath}
                  &nbsp;
                  <button
                    onClick={() => {
                      onClickGitAdd(filepath)
                    }}
                  >
                    add to stage
                  </button>
                </div>
              )
            })}
          </>
        )}
        {removedInFS.length > 0 && (
          <>
            <StatusText>[removed]</StatusText>
            {removedInFS.map(filepath => {
              return (
                <div key={filepath}>
                  {filepath}
                  &nbsp;
                  <button
                    onClick={() => {
                      onClickGitRemove(filepath)
                    }}
                  >
                    remove from git
                  </button>
                </div>
              )
            })}
          </>
        )}

        {untracked.length > 0 && (
          <>
            <StatusText>[untracked]</StatusText>
            {untracked.map(filepath => {
              return (
                <div key={filepath}>
                  {filepath}
                  &nbsp;
                  <button
                    onClick={() => {
                      onClickGitAdd(filepath)
                    }}
                  >
                    add to stage
                  </button>
                </div>
              )
            })}
          </>
        )}
      </div>
    )
  }
}

const StatusText = styled.div``
