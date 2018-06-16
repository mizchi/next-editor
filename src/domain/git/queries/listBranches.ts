import fs from "fs"
import * as git from "isomorphic-git"

export function listBranches(projectRoot: string): Promise<string[]> {
  return git.listBranches({ fs, dir: projectRoot })
}
