import React from "react"
import { CommitDescription } from "../../../../domain/types"

export function GitCommitHistory({
  history
}: {
  history: CommitDescription[]
}) {
  return (
    <div>
      <fieldset style={{ height: "100%" }}>
        <legend>Log</legend>
        <div style={{ fontFamily: "Inconsolata, monospace" }}>
          {history.map((descrption, idx) => {
            const name =
              (descrption.committer && descrption.committer.name) ||
              "<anonymous>"
            const message =
              (descrption.error && `(${descrption.error.message})`) ||
              descrption.message
            return (
              <div key={descrption.oid}>
                {descrption.oid.slice(0, 7)} | {name} | {message}
              </div>
            )
          })}
        </div>
      </fieldset>
    </div>
  )
}
