import * as git from "isomorphic-git"
import path from "path"
import { mkdir } from "../../filesystem/commands/mkdir"
import { writeFile } from "../../filesystem/commands/writeFile"
import { existsPath } from "../../filesystem/queries/existsPath"
import { Repository } from "../../types"

export async function ensureProjectRepository(repo: Repository) {
  // ensure directory
  if (await existsPath(repo.dir)) {
    console.log("Project: already exists")
  } else {
    console.log("Project: creating...")
    await mkdir(repo.dir)
    await mkdir(path.join(repo.dir, "src"))
    await writeFile(path.join(repo.dir, "README.md"), "# Hello!")
    await writeFile(path.join(repo.dir, "src/index.js"), "export default {}")
    console.log("Project: creating done")
  }

  // ensure git
  if (await existsPath(path.join(repo.dir, ".git"))) {
    console.log(".git: already exists")
  } else {
    await git.init(repo)
  }
}
