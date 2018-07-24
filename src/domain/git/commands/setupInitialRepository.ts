import fs from "fs"
import * as git from "isomorphic-git"
import path from "path"
import { mkdir } from "../../filesystem/commands/mkdir"
import { writeFile } from "../../filesystem/commands/writeFile"
import { existsPath } from "../../filesystem/queries/existsPath"

const j = path.join

const INTRODUCTION = `# Playground

This file may be rewrite by update

You can edit this field.
`

const SCRATCH = `# Welcome to NextEditor!

Edit here...
`

const GIT_IGNORE = `out\nbuild`

export async function setupInitialRepository(projectRoot: string) {
  // ensure directory
  if (await existsPath(projectRoot)) {
    // Pass
  } else {
    console.info("Project: creating...")
    await mkdir(projectRoot)
    await mkdir(path.join(projectRoot, "docs"))
    await writeFile(path.join(projectRoot, "README.md"), INTRODUCTION)
    await writeFile(path.join(projectRoot, ".gitignore"), GIT_IGNORE)
    await writeFile(path.join(projectRoot, "scratch.md"), SCRATCH)
    console.info("Project: creating done")
  }

  // ensure git
  if (await existsPath(j(projectRoot, ".git"))) {
    // Pass
  } else {
    await git.init({ fs, dir: projectRoot })
    await git.add({
      dir: "/playground",
      filepath: "README.md",
      fs
    })
    await git.add({
      dir: "/playground",
      filepath: ".gitignore",
      fs
    })
    await git.add({
      dir: "/playground",
      filepath: "scratch.md",
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
  }
}
