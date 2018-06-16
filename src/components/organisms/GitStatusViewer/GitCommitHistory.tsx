import React from "react"
import { CommitDescription } from "../../../lib/repository"

export function GitCommitHistory({
  history
}: {
  history: CommitDescription[]
}) {
  return (
    <>
      <h3>Log</h3>
      <div style={{ fontFamily: "monospace" }}>
        {history.map((descrption, idx) => {
          return (
            <div key={descrption.oid}>
              {descrption.oid.slice(0, 7)} - {descrption.message}
            </div>
          )
        })}
      </div>
    </>
  )
}
