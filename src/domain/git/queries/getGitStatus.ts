import fs from "fs"
import * as git from "isomorphic-git"

export async function getGitStatus(
  projectRoot: string,
  relpath: string
): Promise<string> {
  try {
    const status = await git.status({ fs, dir: projectRoot, filepath: relpath })
    return status
  } catch (e) {
    return "untracked"
  }
}
