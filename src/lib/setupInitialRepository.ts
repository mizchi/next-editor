import fs from "fs"
import * as git from "isomorphic-git"
import path from "path"
import { mkdir } from "../domain/filesystem/commands/mkdir"
import { writeFile } from "../domain/filesystem/commands/writeFile"
import { existsPath } from "../domain/filesystem/queries/existsPath"

const j = path.join

const Introduction = `# Next Editor

Standalone Git Editor

## How to use git

TBD

## How to push

TBD

`

/* WRITE */
export async function setupInitialRepository(projectRoot: string) {
  // ensure directory
  if (await existsPath(projectRoot)) {
    console.log("Project: already exists")
  } else {
    console.log("Project: creating...")
    await mkdir(projectRoot)
    await writeFile(path.join(projectRoot, "README.md"), Introduction)
    // await writeFileInRepository(repo, "src/index.js", "export default {}")
    console.log("Project: creating done")
  }

  // ensure git
  if (await existsPath(j(projectRoot, ".git"))) {
    console.log(".git: already exists")
  } else {
    await git.init({ fs, dir: projectRoot })
    await git.add({
      dir: "/playground",
      filepath: "README.md",
      fs
    })
    await git.commit({
      author: {
        email: "dummy",
        name: "system"
      },
      dir: "/playground",
      fs,
      message: "Init"
    })
    console.log("Ensure initial commit")
  }
}
