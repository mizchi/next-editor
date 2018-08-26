import * as git from "isomorphic-git"
export async function createBranch(
  projectRoot: string,
  newBranchName: string
): Promise<void> {
  return git.branch({ dir: projectRoot, ref: newBranchName })
}
