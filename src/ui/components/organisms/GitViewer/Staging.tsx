import invertBy from "lodash/invertBy"
import React from "react"
import { GitStagingStatus, GitStatusString } from "../../../../domain/types"
import { ConfigState } from "../../../reducers/config"
import { CommandWithInput } from "../../atoms/CommandWithInput"

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

const STAGED_KEYS: GitStatusString[] = ["modified", "deleted", "added"]
const MODIFIED_KEYS: GitStatusString[] = ["*modified", "*deleted", "*absent"]
const UNTRAKED_KEYS: GitStatusString[] = ["*added"]

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

  const inv: { [s in GitStatusString]: string[] | null } = invertBy(
    staging
  ) as any
  const hasStaged: boolean = STAGED_KEYS.some(key => !!(inv as any)[key])
  const hasModified: boolean = MODIFIED_KEYS.some(key => !!(inv as any)[key])
  const hasUntracked: boolean = UNTRAKED_KEYS.some(key => !!(inv as any)[key])
  const hasError: boolean = !!inv.__error__
  const hasChanges = hasStaged || hasModified
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
