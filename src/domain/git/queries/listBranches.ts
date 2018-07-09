import fs from "fs"
import * as git from "isomorphic-git"

export function listBranches(
  projectRoot: string,
  remote: string | null = null
): Promise<string[]> {
  return git.listBranches({ fs, dir: projectRoot, remote })
}

export async function listRemoteBranches(
  projectRoot: string,
  remote: string
): Promise<string[]> {
  try {
    return git.listBranches({ fs, dir: projectRoot, remote })
  } catch (e) {
    // TODO: Check remote fetched once
    return []
  }
}
