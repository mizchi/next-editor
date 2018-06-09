import fs from "fs"
import * as git from "isomorphic-git"
import orderBy from "lodash/orderBy"
import path from "path"
import pify from "pify"

const j = path.join

export type Repository = {
  fs: any
  dir: string
}

export type FileInfo = {
  name: string
  type: "file" | "dir"
}

/* READ */
export async function readFileStats(dPath: string): Promise<FileInfo[]> {
  const filenames: string[] = await pify(fs.readdir)(dPath)

  const ret: any = await Promise.all(
    filenames.map(async name => {
      const childPath = j(dPath, name)
      const stat = await pify(fs.stat)(childPath)
      return {
        name,
        type: stat.isDirectory() ? "dir" : "file"
      }
    })
  )
  return orderBy(ret, [(s: FileInfo) => s.type + "" + s.name])
}

export async function readFile(filepath: string): Promise<string> {
  const file = await pify(fs.readFile)(filepath)
  return file.toString()
}

export async function readFilesInRepository(
  repo: Repository,
  relPath: string
): Promise<FileInfo[]> {
  const aPath = j(repo.dir, relPath)
  return readFileStats(aPath)
}

export async function existsPath(aPath: string): Promise<boolean> {
  try {
    // NOTE: fs.access is not supported
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

export async function addFileInRepository(
  repo: Repository,
  filepath: string
): Promise<any> {
  return await git.add({ ...repo, filepath })
}

export async function commitChangesInRepository(
  repo: Repository,
  message: string,
  _author?: { name: string; email: string }
): Promise<string> {
  const author = _author || { name: "anonymous", email: "dummy" }
  const ret: any = { ...repo, message, author }
  return await git.commit(ret)
}

export async function commitSingleFileInRepository(
  repo: Repository,
  filepath: string,
  content: string,
  message: string = "Update"
): Promise<string> {
  await writeFileInRepository(repo, filepath, content)
  await addFileInRepository(repo, filepath)
  return await commitChangesInRepository(repo, message)
}

export async function unlink(aPath: string): Promise<void> {
  await pify(fs.unlink)(aPath)
}
