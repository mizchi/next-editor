import React from "react"
import { GitFileStatus } from "../../../domain/types"
import { Command } from "../../atoms/Command"

type Props = {
  stagedChanges: GitFileStatus[]
  unstagedChanges: GitFileStatus[]
  loading: boolean
  untracked: string[]
  onClickGitAdd: (filepath: string) => void
  onClickGitRemove: (filepath: string) => void
  onClickGitCommit: (message: string) => void
  onClickGitCommitUnstaged: (message: string) => void
}

export function GitCommitStatus(props: Props) {
  const {
    stagedChanges,
    unstagedChanges,
    untracked,
    loading,
    onClickGitAdd,
    onClickGitCommit,
    onClickGitCommitUnstaged,
    onClickGitRemove
  } = props

  if (loading) {
    return <span>Git Status Loading...</span>
  }

  const hasStagedChanges = stagedChanges.length > 0
  const hasUnstagedChanges = unstagedChanges.length > 0
  const hasChanges = hasStagedChanges || hasUnstagedChanges
  return (
    <div>
      <fieldset>
        <legend> Staging </legend>
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
          <fieldset>
            <legend>staged</legend>
            {stagedChanges.map(change => {
              return (
                <div key={change.relpath}>
                  {change.relpath} ({change.status})
                </div>
              )
            })}
          </fieldset>
        )}
        {hasUnstagedChanges && (
          <fieldset>
            <legend>unstaged</legend>
            {unstagedChanges.map(change => {
              const needRemoveAction = ["*deleted", "*absent"].includes(
                change.status
              )
              return (
                <div key={change.relpath}>
                  {change.relpath}
                  &nbsp; ({change.status}) &nbsp;
                  {needRemoveAction && (
                    <button
                      onClick={() => {
                        onClickGitRemove(change.relpath)
                      }}
                    >
                      remove from git
                    </button>
                  )}
                  {!needRemoveAction && (
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
          </fieldset>
        )}
        {untracked.length > 0 && (
          <fieldset>
            <legend>untracked</legend>
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
          </fieldset>
        )}
      </fieldset>
    </div>
  )
}
