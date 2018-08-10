import { GitStagingStatus } from "./types"

export type FileInfo = {
  name: string
  gitStatus: string
  type: "file" | "dir"
  ignored: boolean
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

export type GitRepositoryStatus = {
  currentBranch: string
  branches: string[]
  history: CommitDescription[]
}

export type GitStagingStatus = {
  [fpath: string]: GitStagingStatus
}

// https://isomorphic-git.github.io/docs/status.html
export type GitStatusString =
  // not staged
  | "ignored"
  | "absent"
  | "unmodified"
  // staged chages
  | "modified"
  | "deleted"
  | "added"
  // unstaged changes
  | "*modified"
  | "*deleted"
  | "*added"
  | "*unmodified"
  | "*absent"
  // internal error
  | "__error__"

export type GitTrackingStatus = {
  tracked: string[]
  untracked: string[]
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
export interface TreeDescription {
  entries: TreeEntry[]
}

export interface TreeEntry {
  mode: string
  path: string
  oid: string
  type?: string
}

export interface TagDescription {
  object: string
  type: "blob" | "tree" | "commit" | "tag"
  tag: string
  tagger: {
    name: string // The tagger's name
    email: string // The tagger's email
    timestamp: number // UTC Unix timestamp in seconds
    timezoneOffset: number // Timezone difference from UTC in minutes
  }
  message: string
  signature?: string
}

export interface GitObjectDescription {
  oid: string
  type?: "blob" | "tree" | "commit" | "tag"
  format: "deflated" | "wrapped" | "content" | "parsed"
  object: Buffer | CommitDescription | TreeDescription | TagDescription
  source?: string
}

export interface GitBlobDescription {
  oid: string
  type: "blob"
  format: "deflated" | "wrapped" | "content" | "parsed"
  object: Buffer
  source?: string
}
