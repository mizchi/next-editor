import fs from "fs"
import * as git from "isomorphic-git"
import path from "path"
import pify from "pify"

export type Repository = {
  fs: any
  dir: string
}

export async function initGitProject(repo: Repository) {
  try {
    await pify(fs.mkdir)(repo.dir)
  } catch (e) {
    console.log("Git: already exists")
  }

  // const existed = await pify(window.fs.exists)(path.join(repo.dir, ".git"))
  // if (!existed) {
  //   await git.init(repo)
  // } else {
  //   console.log("Git: already exists")
  // }
  return
}

export async function writeFileInRepository(
  repo: Repository,
  filepath: string,
  content: string
): Promise<void> {
  return await pify(fs.writeFile)(path.join(repo.dir, filepath), content)
}

export function readFiles(aPath: string): Promise<string[]> {
  return pify(fs.readdir)(aPath)
}

export async function readFilesInRepository(
  repo: Repository,
  relPath: string
): Promise<string[]> {
  const aPath = path.join(repo.dir, relPath)
  return readFiles(aPath)
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
