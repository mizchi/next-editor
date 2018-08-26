import * as git from "isomorphic-git"
import path from "path"
import { mkdir } from "../../filesystem/commands/mkdir"
import { writeFile } from "../../filesystem/commands/writeFile"

export async function createProject(newProjectRoot: string): Promise<void> {
  await mkdir(newProjectRoot)
  await git.init({ dir: newProjectRoot })
  const outpath = path.join(newProjectRoot, "README.md")
  await writeFile(outpath, "# New Project")
  await git.add({ dir: newProjectRoot, filepath: "README.md" })
  await git.commit({
    dir: newProjectRoot,
    author: { name: "system", email: "dummy" },
    message: "Init"
  })
}
