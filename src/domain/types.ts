export type FileInfo = {
  name: string
  gitStatus: string
  type: "file" | "dir"
}
export type Repository = {
  fs: any
  dir: string
}

export type FileNode =
  | {
      type: "dir"
      pathname: string
      children: FileNode[]
    }
  | {
      type: "file"
      pathname: string
    }

// https://isomorphic-git.github.io/docs/log.html
export type CommitDescription = {
  oid: string // SHA1 object id of this commit
  message: string // Commit message
  tree: string // SHA1 object id of corresponding file tree
  parent: string[] // an array of zero or more SHA1 object ids
  author: {
    name: string // The author's name
    email: string // The author's email
    timestamp: number // UTC Unix timestamp in seconds
    timezoneOffset: number // Timezone difference from UTC in minutes
  }
  committer: {
    name: string // The committer's name
    email: string // The committer's email
    timestamp: number // UTC Unix timestamp in seconds
    timezoneOffset: number // Timezone difference from UTC in minutes
  }
  gpgsig?: string // PGP signature (if present)
  error?: {
    code: string
    data: any
    message: string
    name: string
  }
}

export type GitFileStatus = {
  relpath: string
  status: GitStatusString | "error"
  staged: boolean
}

export type GitRepositoryStatus = {
  currentBranch: string
  branches: string[]
  history: CommitDescription[]
}

export type GitStagingStatus = {
  raw: GitFileStatus[]
  staged: string[]
  modified: string[]
  unmodified: string[]
}

// https://isomorphic-git.github.io/docs/status.html
export type GitStatusString =
  | "ignored"
  | "unmodified"
  | "absent"
  | "modified"
  | "deleted"
  | "added"
  | "*modified"
  | "*deleted"
  | "*added"
  | "*unmodified"
  | "*absent"

export type GitTrackingStatus = {
  tracked: string[]
  untracked: string[]
}
