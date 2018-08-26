import fs from "fs"
import * as git from "isomorphic-git"
import path from "path"
import rimraf from "rimraf"
import uuid from "uuid"

import { plugins } from "isomorphic-git"

plugins.set("fs", fs)

const repos: string[] = []

afterAll(() => {
  repos.map(repo => {
    rimraf.sync(repo)
  })
})

export async function createTempGitProject() {
  const tempRoot = "/tmp/__tempRoot__" + uuid()
  repos.push(tempRoot)

  await fs.promises.mkdir(tempRoot)
  await git.init({ dir: tempRoot })

  return tempRoot
}

export async function batchUpdateFiles(
  projectRoot: string,
  files: Array<[string, string]>,
  message: string = "Update"
): Promise<string> {
  for (const [filename, content] of files) {
    await fs.promises.writeFile(path.join(projectRoot, filename), content)
    await git.add({ dir: projectRoot, filepath: filename })
  }
  return git.commit({
    dir: projectRoot,
    message,
    author: { name: "test", email: "test" }
  })
}
