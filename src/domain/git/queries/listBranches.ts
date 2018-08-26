import * as git from "isomorphic-git"

export function listBranches(
  projectRoot: string,
  remote: string | null = null
): Promise<string[]> {
  return git.listBranches({ dir: projectRoot, remote })
}

export async function listRemoteBranches(
  projectRoot: string,
  remote: string
): Promise<string[]> {
  try {
    const branches: string[] = await git.listBranches({
      dir: projectRoot,
      remote
    })
    return branches.map(b => `remotes/${remote}/${b}`)
  } catch (e) {
    // TODO: Check remote fetched once
    return []
  }
}
