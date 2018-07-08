import fs from "fs"
import * as git from "isomorphic-git"
import { GitStatusString } from "../../types"

export async function getFileStatus(
  projectRoot: string,
  relpath: string,
  ref: string | null = null
): Promise<GitStatusString | "error"> {
  try {
    return await git.status({ fs, dir: projectRoot, filepath: relpath, ref })
  } catch (e) {
    return "error"
  }
}
