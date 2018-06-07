import fs from "fs"
import * as git from "isomorphic-git"
import orderBy from "lodash/orderBy"
import path from "path"
import pify from "pify"

export type Repository = {
  fs: any
  dir: string
}

export type FileInfo = {
  name: string
  type: "file" | "dir"
}

const sampleJs = `import React from 'react'
export default () => <h1>Hello, JS</h1>
`

export async function initGitProject(repo: Repository) {
  try {
    await pify(fs.mkdir)(repo.dir)
    console.log("Git: create")
    await pify(fs.writeFile)(repo.dir + "/README.md", "# Hello!")
    await pify(fs.writeFile)(repo.dir + "/index.js", sampleJs)
  } catch (e) {
    console.log("Git: already exists")
  }

  const existed = await pify(fs.exists)(path.join(repo.dir, ".git"))
  if (!existed) {
    await git.init(repo)
  } else {
    console.log("Git: already exists")
  }
  return
}

export async function writeFile(aPath: string, content: string): Promise<void> {
  return await pify(fs.writeFile)(aPath, content)
}

export async function writeFileInRepository(
  repo: Repository,
  filepath: string,
  content: string
): Promise<void> {
  return await pify(fs.writeFile)(path.join(repo.dir, filepath), content)
}

export async function readFileStats(dPath: string): Promise<FileInfo[]> {
  const filenames: string[] = await pify(fs.readdir)(dPath)

  const ret: any = await Promise.all(
    filenames.map(async name => {
      const childPath = path.join(dPath, name)
      const stat = await pify(fs.stat)(childPath)
      return {
        name,
        type: stat.isDirectory() ? "dir" : "file"
      }
    })
  )
  return orderBy(ret, [(s: FileInfo) => s.type + "" + s.name])
}

export async function readFilesInRepository(
  repo: Repository,
  relPath: string
): Promise<FileInfo[]> {
  const aPath = path.join(repo.dir, relPath)
  return readFileStats(aPath)
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
