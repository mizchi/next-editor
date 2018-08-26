import * as git from "isomorphic-git"
import { CommitDescription } from "../../types"

export async function getHistory(
  projectRoot: string,
  { depth, ref = "master" }: { depth?: number; ref?: string }
): Promise<CommitDescription[]> {
  return git.log({ dir: projectRoot, depth, ref })
}
