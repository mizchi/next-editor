import fs from "fs"
import * as git from "isomorphic-git"
import path from "path"
import { mkdir } from "../../filesystem/commands/mkdir"
import { writeFile } from "../../filesystem/commands/writeFile"
import { existsPath } from "../../filesystem/queries/existsPath"

const j = path.join

const Introduction = `# Next Editor

Standalone Git Editor

## How to use git

Remote features are not stable yet.

## How to use your own cors proxy

See detail https://github.com/wmhilton/cors-buster
\`\`\`
$ npm i -g now
# login to now
$ now wmhilton/cors-buster
\`\`\`

Set your githubProxy on config \`<your proxy>/github.com/\`
`

export async function setupInitialRepository(projectRoot: string) {
  // ensure directory
  if (await existsPath(projectRoot)) {
    // Pass
  } else {
    console.info("Project: creating...")
    await mkdir(projectRoot)
    await writeFile(path.join(projectRoot, "README.md"), Introduction)
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
