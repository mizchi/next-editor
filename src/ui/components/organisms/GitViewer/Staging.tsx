import React from "react"
import {
  getModifiedFilenames,
  getRemovableFilenames,
  getRemovedFilenames,
  getStagedFilenames
} from "../../../../domain/git/queries/parseStatusMatrix"
import { StatusMatrix } from "../../../../domain/types"
import { ConfigState } from "../../../reducers/config"
import { CommandWithInput } from "../../atoms/CommandWithInput"

type Props = {
  statusMatrix: StatusMatrix
  config: ConfigState
  onClickReload: () => void
  onClickOpenConfig: () => void
  onClickGitAdd: (filepath: string) => void
  onClickGitRemove: (filepath: string) => void
  onClickGitCommit: (message: string) => void
  onClickGitReset: (filepath: string) => void
}

export function Staging(props: Props) {
  const {
    statusMatrix,
    config,
    onClickReload,
    onClickGitAdd,
    onClickGitCommit,
    onClickGitRemove
  } = props

  if (statusMatrix == null) {
    return (
      <div>
        <fieldset>
          <legend> Staging </legend>
          Git Status Loading...
        </fieldset>
      </div>
    )
  }

  const removable = getRemovableFilenames(statusMatrix)
  // TODO: Show removed
  const removed = getRemovedFilenames(statusMatrix)

  const staged = getStagedFilenames(statusMatrix)

  const modified = getModifiedFilenames(statusMatrix).filter(
    f => !removable.includes(f) && !staged.includes(f) && !removed.includes(f)
  )

  const canCommit = staged.length > 0 || removed.length > 0

  return (
    <div>
      <fieldset>
        <legend>Staging</legend>
        {canCommit && (
          <>
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
          </>
        )}

        <h5>staged</h5>
        {staged.map(fname => {
          // TODO: reset
          return (
            <p key={fname}>
              {fname} :
              <button
                onClick={() => {
                  props.onClickGitReset(fname)
                }}
              >
                reset
              </button>
            </p>
          )
        })}

        {removed.map(fname => {
          // TODO: reset
          return (
            <p key={fname}>
              {fname} :
              <button
                onClick={() => {
                  props.onClickGitReset(fname)
                }}
              >
                restore
              </button>
            </p>
          )
        })}

        <h5>modified</h5>
        {modified.map(fname => {
          return (
            <p key={fname}>
              {fname} :
              <button
                onClick={() => {
                  onClickGitAdd(fname)
                }}
              >
                add to stage
              </button>
            </p>
          )
        })}

        <h5>deleted</h5>
        {removable.map(fname => {
          return (
            <p key={fname}>
              {fname} :
              <button
                onClick={() => {
                  onClickGitRemove(fname)
                }}
              >
                remove from git
              </button>
            </p>
          )
        })}
      </fieldset>
    </div>
  )
}
