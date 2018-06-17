import fs from "fs"
import * as git from "isomorphic-git"
import { GitStatusString } from "./../../types"

export async function getGitStatus(
  projectRoot: string,
  relpath: string
): Promise<GitStatusString | "error"> {
  try {
    return await git.status({ fs, dir: projectRoot, filepath: relpath })
  } catch (e) {
    return "error"
  }
}
