import * as git from "isomorphic-git"
export async function checkoutBranch(
  projectRoot: string,
  branchName: string
): Promise<void> {
  return git.checkout({ dir: projectRoot, ref: branchName })
}
