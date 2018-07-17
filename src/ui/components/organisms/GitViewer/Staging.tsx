import React from "react"
import { GitStagingStatus } from "../../../../domain/types"
import { ConfigState } from "../../../reducers/config"
import { CommandWithInput } from "../../atoms/CommandWithInput"
import {
  buildGroupedGitStatus,
  MODIFIED_KEYS,
  STAGED_KEYS,
  UNTRAKED_KEYS
} from "./helpers"

type Props = {
  staging: GitStagingStatus
  loading: boolean
  config: ConfigState
  onClickReload: () => void
  onClickOpenConfig: () => void
  onClickGitAdd: (filepath: string) => void
  onClickGitRemove: (filepath: string) => void
  onClickGitCommit: (message: string) => void
}

export function Staging(props: Props) {
  if (props.loading) {
    return (
      <div>
        <fieldset>
          <legend> Staging </legend>
          Git Status Loading...
        </fieldset>
      </div>
    )
  }

  const {
    staging,
    config,
    onClickReload,
    onClickGitAdd,
    onClickGitCommit,
    onClickGitRemove
  } = props

  const {
    grouped: inv,
    hasChanges,
    hasModified,
    hasUntracked,
    hasError,
    hasStaged
  } = buildGroupedGitStatus(staging)

  return (
    <div>
      <fieldset>
        <legend>Staging</legend>
        {!hasChanges && <>No changes</>}
        {hasStaged && (
          <fieldset>
            <legend>staged</legend>
            <CommandWithInput
              description="Commit"
              validate={value => value.length > 0}
              onExec={value => {
                onClickGitCommit(value)
              }}
            />
            {!config.committerName &&
              !config.committerEmail && (
                <button
                  onClick={() => {
                    props.onClickOpenConfig()
                  }}
                >
                  Set name/email by config
                </button>
              )}
            {STAGED_KEYS.map(key => {
              const files = inv[key] || []
              return files.map(relpath => (
                <div key={relpath}>
                  {relpath} ({key})
                </div>
              ))
            })}
          </fieldset>
        )}
        {hasModified && (
          <fieldset>
            <legend>modified</legend>
            {MODIFIED_KEYS.map(key => {
              const files = inv[key] || []
              const needRemoveAction = ["*deleted", "*absent"].includes(key)
              return files.map(relpath => (
                <div key={relpath}>
                  {relpath}
                  &nbsp; ({key}) &nbsp;
                  {needRemoveAction && (
                    <button
                      onClick={() => {
                        onClickGitRemove(relpath)
                      }}
                    >
                      remove from git
                    </button>
                  )}
                  {!needRemoveAction && (
                    <button
                      onClick={() => {
                        onClickGitAdd(relpath)
                      }}
                    >
                      add to stage
                    </button>
                  )}
                </div>
              ))
            })}
          </fieldset>
        )}
        {hasUntracked && (
          <fieldset>
            <legend>untracked</legend>
            {UNTRAKED_KEYS.map(key => {
              const files = inv[key] || []
              return files.map(relpath => (
                <div key={relpath}>
                  {relpath}
                  &nbsp;
                  <button
                    onClick={() => {
                      onClickGitAdd(relpath)
                    }}
                  >
                    add to stage
                  </button>
                </div>
              ))
            })}
          </fieldset>
        )}
        {hasError && (
          <fieldset>
            <legend>error</legend>
            <button onClick={() => onClickReload()}>Reload</button>
            {(inv.__error__ || []).map(relpath => {
              return <div key={relpath}>{relpath}</div>
            })}
          </fieldset>
        )}
      </fieldset>
    </div>
  )
}
