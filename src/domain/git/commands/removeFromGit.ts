import * as git from "isomorphic-git"
export async function removeFromGit(
  projectRoot: string,
  filepath: string
): Promise<void> {
  await git.remove({ dir: projectRoot, filepath })
}
