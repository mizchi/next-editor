import fs from "fs"
import * as git from "isomorphic-git"
export function cloneRepository(
  projectRoot: string,
  clonePath: string
): Promise<void> {
  return git.clone({
    fs,
    dir: projectRoot,
    url: clonePath,
    singleBranch: true,
    depth: 1
  })
}
