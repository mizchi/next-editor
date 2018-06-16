import fs from "fs"
import * as git from "isomorphic-git"
import flatten from "lodash/flatten"
import orderBy from "lodash/orderBy"
import zipWith from "lodash/zipWith"
import path from "path"
import pify from "pify"

const j = path.join

export type Repository = {
  fs: any
  dir: string
}

export type FileInfo = {
  name: string
  gitStatus: string
  type: "file" | "dir"
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
}

export type GitRepositoryStatus = {
  currentBranch: string
  branches: string[]
  stagingStatus: GitStagingStatus
  trackingStatus: GitTrackingStatus
  history: CommitDescription[]
}

export type GitStagingStatus = {
  added: string[]
  staged: string[]
  modified: string[]
  unmodified: string[]
}

export type GitTrackingStatus = { tracked: string[]; untracked: string[] }

/* READ */
export async function readFileStats(
  projectRoot: string,
  dirpath: string
): Promise<FileInfo[]> {
  const filenames: string[] = await pify(fs.readdir)(dirpath)

  const ret: any = await Promise.all(
    filenames.map(async name => {
      const childPath = j(dirpath, name)
      const stat = await pify(fs.stat)(childPath)
      const relpath = path.relative(projectRoot, childPath)
      // const gitStatus = await getGitStatusInRepository(projectRoot, relpath)
      return {
        gitStatus: "nop",
        name,
        type: stat.isDirectory() ? "dir" : "file"
      }
    })
  )
  return orderBy(ret, [(s: FileInfo) => s.type + "" + s.name])
}

export async function getProjectGitStatus(
  projectRoot: string
): Promise<GitRepositoryStatus> {
  const trackingStatus = await getGitTrackingStatus(projectRoot)
  const { tracked } = trackingStatus

  const fileStatusList: Array<{
    relpath: string
    status: string
  }> = await Promise.all(
    tracked.map(async relpath => {
      const status = await getGitStatusInRepository(projectRoot, relpath)
      return { relpath, status }
    })
  )

  const stagingStatus: GitStagingStatus = fileStatusList.reduce(
    (acc: GitStagingStatus, fileStatus) => {
      console.log("status:", fileStatus.relpath, fileStatus.status)
      switch (fileStatus.status) {
        case "*modified": {
          return { ...acc, modified: [...acc.modified, fileStatus.relpath] }
        }
        case "added": {
          return { ...acc, added: [...acc.added, fileStatus.relpath] }
        }
        // added and modified
        case "*added": {
          return {
            ...acc,
            added: [...acc.added, fileStatus.relpath],
            modified: [...acc.modified, fileStatus.relpath]
          }
        }
        case "modified": {
          return { ...acc, staged: [...acc.staged, fileStatus.relpath] }
        }
        case "unmodified": {
          return { ...acc, unmodified: [...acc.unmodified, fileStatus.relpath] }
        }
        default: {
          return acc
        }
      }
    },
    {
      added: [],
      modified: [],
      staged: [],
      unmodified: []
    }
  )

  const currentBranch = await git.currentBranch({ fs, dir: projectRoot })
  const branches = await git.listBranches({ fs, dir: projectRoot })
  const history = await getLogInRepository(projectRoot, { ref: currentBranch })
  return {
    branches,
    currentBranch,
    stagingStatus,
    trackingStatus,
    history
  }
}

export async function getGitTrackingStatus(
  projectRoot: string
): Promise<GitTrackingStatus> {
  // buffer
  const untracked = []
  const tracked = []

  const gitFiles: string[] = await git.listFiles({ fs, dir: projectRoot })
  const gitFilepathIndexed: { [s: string]: boolean } = gitFiles.reduce(
    (acc: { [s: string]: boolean }, pathname: string) => {
      const relpath = pathname.replace(projectRoot, "")
      return { ...acc, [relpath]: true }
    },
    {}
  )

  const allFiles = await getFilesRecursively(projectRoot)
  const relativeFilepaths = allFiles.map(pathname =>
    pathname.replace(projectRoot + "/", "")
  )

  for (const relpath of relativeFilepaths) {
    if (gitFilepathIndexed[relpath]) {
      tracked.push(relpath)
    } else {
      untracked.push(relpath)
    }
  }
  return {
    tracked,
    untracked
  }
}

export async function getFilesRecursively(rootPath: string): Promise<string[]> {
  const node = await readRecursiveFileNode(rootPath)
  return nodeToFileList(node)
}

function nodeToFileList(node: FileNode): string[] {
  if (node.type === "file") {
    return [node.pathname]
  } else if (node.type === "dir") {
    const ret = node.children.map(childNode => {
      return nodeToFileList(childNode)
    })
    return flatten(ret)
  } else {
    return []
  }
}

const IGNORE_PATTERNS = [".git"]

export async function readRecursiveFileNode(
  pathname: string
): Promise<FileNode> {
  // console.log("current node", pathname)
  const stat = await pify(fs.stat)(pathname)
  if (stat.isDirectory()) {
    const pathList: string[] = await pify(fs.readdir)(pathname)
    const children = await Promise.all(
      pathList
        .filter(childPath => !IGNORE_PATTERNS.includes(childPath))
        .map(childPath => readRecursiveFileNode(path.join(pathname, childPath)))
    )
    return {
      children,
      pathname,
      type: "dir"
    }
  } else {
    return {
      pathname,
      type: "file"
    }
  }
}

export async function getLogInRepository(
  projectRoot: string,
  { depth, ref = "master" }: { depth?: number; ref?: string }
): Promise<CommitDescription[]> {
  return git.log({ fs, dir: projectRoot, depth, ref })
}

export async function readFile(filepath: string): Promise<string> {
  const file = await pify(fs.readFile)(filepath)
  return file.toString()
}

export function listBranches(projectRoot: string): Promise<string[]> {
  return git.listBranches({ fs, dir: projectRoot })
}

export async function existsPath(aPath: string): Promise<boolean> {
  try {
    // NOTE: fs.access is not supported in browserfs
    await pify(fs.stat)(aPath)
    return true
  } catch (e) {
    return false
  }
}

/* WRITE */
export async function ensureProjectRepository(repo: Repository) {
  // ensure directory
  if (await existsPath(repo.dir)) {
    console.log("Project: already exists")
  } else {
    console.log("Project: creating...")
    await mkdirInRepository(repo, "")
    await mkdirInRepository(repo, "src")
    await writeFileInRepository(repo, "README.md", "# Hello!")
    await writeFileInRepository(repo, "src/index.js", "export default {}")
    console.log("Project: creating done")
  }

  // ensure git
  if (await existsPath(j(repo.dir, ".git"))) {
    console.log(".git: already exists")
  } else {
    await git.init(repo)
  }
}

export async function getGitStatusInRepository(
  projectRoot: string,
  relpath: string
): Promise<string> {
  try {
    const status = await git.status({ fs, dir: projectRoot, filepath: relpath })
    return status
  } catch (e) {
    return "untracked"
  }
}

export async function listGitFilesInRepository(
  projectRoot: string
): Promise<
  Array<{
    filepath: string
    gitStatus: string
  }>
> {
  const files: string[] = await git.listFiles({ fs, dir: projectRoot })
  const statusList = await Promise.all(
    files.map(f => getGitStatusInRepository(projectRoot, f))
  )
  return zipWith(files, statusList, (filepath, gitStatus) => ({
    filepath,
    gitStatus
  }))
}

/* WRITE */
export async function writeFile(aPath: string, content: string): Promise<void> {
  await pify(fs.writeFile)(aPath, content)
}

export async function writeFileInRepository(
  repo: Repository,
  filepath: string,
  content: string
): Promise<void> {
  const aPath = j(repo.dir, filepath)
  await pify(fs.writeFile)(aPath, content)
}

export async function createBranch(
  projectRoot: string,
  newBranchName: string
): Promise<void> {
  return git.branch({ fs, dir: projectRoot, ref: newBranchName })
}

export async function checkoutBranch(
  projectRoot: string,
  branchName: string
): Promise<void> {
  return git.checkout({ fs, dir: projectRoot, ref: branchName })
}

export async function mkdir(dirpath: string): Promise<void> {
  if (await existsPath(dirpath)) {
    // Do nothing
    console.info("mkdir: exists", dirpath)
  } else {
    await pify(fs.mkdir)(dirpath)
    console.info("mkdir: done", dirpath)
  }
}

export async function mkdirInRepository(
  repo: Repository,
  dirpath: string
): Promise<void> {
  const aPath = j(repo.dir, dirpath)
  return mkdir(aPath)
}

export function addFileInRepository(
  projectRoot: string,
  relpath: string
): Promise<any> {
  return git.add({ fs, dir: projectRoot, filepath: relpath })
}

export function commitChanges(
  projectRoot: string,
  message: string = "Update",
  author?: { name: string; email: string }
): Promise<string> {
  return git.commit({
    author: author || {
      email: "dummy",
      name: "anonymous"
    },
    dir: projectRoot,
    fs,
    message
  })
}

export async function unlink(aPath: string): Promise<void> {
  await pify(fs.unlink)(aPath)
}
