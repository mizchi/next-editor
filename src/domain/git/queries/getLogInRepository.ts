import fs from "fs"
import * as git from "isomorphic-git"
import { CommitDescription } from "../../types"

export async function getLogInRepository(
  projectRoot: string,
  { depth, ref = "master" }: { depth?: number; ref?: string }
): Promise<CommitDescription[]> {
  return git.log({ fs, dir: projectRoot, depth, ref })
}
