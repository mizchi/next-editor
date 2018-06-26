import React from "react"
import { CommitDescription } from "../../../domain/types"

export function GitCommitHistory({
  history
}: {
  history: CommitDescription[]
}) {
  return (
    <>
      <fieldset style={{ height: "100%" }}>
        <legend>Log</legend>
        <div style={{ fontFamily: '"Courier New", Consolas, monospace' }}>
          {history.map((descrption, idx) => {
            return (
              <div key={descrption.oid}>
                {descrption.oid.slice(0, 7)} | {descrption.committer.name} |{" "}
                {descrption.message}
              </div>
            )
          })}
        </div>
      </fieldset>
    </>
  )
}
