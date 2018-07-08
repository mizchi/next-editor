import { GitFileStatus, GitStatusString } from "../../types"

export function arrangeRawStatus(
  raw: GitFileStatus[]
): { staged: string[]; unstaged: string[]; unmodified: string[] } {
  const staged = raw
    .filter(a => a.staged && a.status !== "unmodified")
    .map(a => a.relpath)

  const unmodified = raw
    .filter(a => a.status === "unmodified")
    .map(a => a.relpath)

  const unstaged = raw.filter(a => !a.staged).map(a => a.relpath)
  return { staged, unstaged, unmodified }
}

function isStaged(status: GitStatusString | "error"): boolean {
  const firstChar = status[0]
  return firstChar !== "*"
}
