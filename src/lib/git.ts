import * as git from "isomorphic-git"
import path from "path"
import pify from "pify"

export type Repository = {
  fs: any
  dir: string
}

export async function initGitProject(repo: Repository) {
  try {
    await pify(window.fs.mkdir)(repo.dir)
  } catch (e) {
    console.log("already exists")
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
  return await pify(window.fs.writeFile)(path.join(repo.dir, filepath), content)
}

export async function readFilesInRepository(
  repo: Repository,
  dirpath: string
): Promise<string[]> {
  return await pify(window.fs.readdir)(repo.dir + "/" + dirpath)
}

export async function addFileInRepository(
  repo: Repository,
  filepath: string
): Promise<string[]> {
  return await git.add({ ...repo, filepath })
}

export async function commitChangesInRepository(
  repo: Repository,
  message: string,
  author?: { name: string; email: string }
): Promise<string> {
  const author2 = author || { name: "anonymous", email: "dummy" }
  return await git.commit({ ...repo, message, author: author2 })
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
