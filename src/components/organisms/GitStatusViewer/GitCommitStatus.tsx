import React from "react"
import styled from "styled-components"
import { GitFileStatus } from "../../../domain/types"
import { Command } from "../../atoms/Command"

export class GitCommitStatus extends React.PureComponent<{
  stagedChanges: GitFileStatus[]
  unstagedChanges: GitFileStatus[]
  untracked: string[]
  onClickGitAdd: (filepath: string) => void
  onClickGitRemove: (filepath: string) => void
  onClickGitCommit: (message: string) => void
  onClickGitCommitUnstaged: (message: string) => void
}> {
  render() {
    const {
      stagedChanges,
      unstagedChanges,
      untracked,
      onClickGitAdd,
      onClickGitCommit,
      onClickGitCommitUnstaged,
      onClickGitRemove
    } = this.props
    const hasStagedChanges = stagedChanges.length > 0
    const hasUnstagedChanges = unstagedChanges.length > 0
    const hasChanges = hasStagedChanges || hasUnstagedChanges
    return (
      <div>
        <h3>Staging</h3>
        {!hasChanges && <>No changes</>}

        {!hasStagedChanges &&
          hasUnstagedChanges && (
            <>
              <div>
                <Command
                  description="Commit all unstaged changes"
                  command="git commit -am $$"
                  onExec={value => {
                    onClickGitCommitUnstaged(value)
                  }}
                />
              </div>
            </>
          )}
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
          </>
        )}
        {hasStagedChanges && (
          <>
            <StatusText>[staged]</StatusText>
            {stagedChanges.map(change => {
              return (
                <div key={change.relpath}>
                  {change.relpath} ({change.status})
                </div>
              )
            })}
          </>
        )}
        {hasUnstagedChanges && (
          <>
            <StatusText>[unstaged]</StatusText>
            {unstagedChanges.map(change => {
              return (
                <div key={change.relpath}>
                  {change.relpath}
                  &nbsp; ({change.status}) &nbsp;
                  {change.status === "*deleted" && (
                    <button
                      onClick={() => {
                        onClickGitRemove(change.relpath)
                      }}
                    >
                      remove from git
                    </button>
                  )}
                  {change.status !== "*deleted" && (
                    <button
                      onClick={() => {
                        onClickGitAdd(change.relpath)
                      }}
                    >
                      add to stage
                    </button>
                  )}
                </div>
              )
            })}
          </>
        )}
        {/* {modified.length > 0 && (
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
        */}

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
