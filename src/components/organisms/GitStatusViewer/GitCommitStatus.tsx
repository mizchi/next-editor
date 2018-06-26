import React from "react"
import { GitFileStatus } from "../../../domain/types"
import { CommandWithInput } from "../../atoms/CommandWithInput"

type Props = {
  stagedChanges: GitFileStatus[]
  unstagedChanges: GitFileStatus[]
  loading: boolean
  untracked: string[]
  onClickReload: () => void
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
    return (
      <div>
        <fieldset>
          <legend> Staging </legend>
          Git Status Loading...
        </fieldset>
      </div>
    )
  }

  const hasStagedChanges = stagedChanges.length > 0
  const hasUnstagedChanges = unstagedChanges.length > 0
  const hasChanges = hasStagedChanges || hasUnstagedChanges
  return (
    <div>
      <fieldset>
        <legend>Staging</legend>
        {!hasChanges && <>No changes</>}

        {!hasStagedChanges &&
          hasUnstagedChanges && (
            <>
              <div>
                <CommandWithInput
                  description="Commit all unstaged changes"
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
              <CommandWithInput
                description="Commit staged changes"
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
            <CommandWithInput
              description="Commit"
              onExec={value => {
                onClickGitCommit(value)
              }}
            />

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
