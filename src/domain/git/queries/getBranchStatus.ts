import fs from "fs"
import * as git from "isomorphic-git"
import { GitRepositoryStatus } from "../../types"
import { getHistory } from "./getHistory"

export async function getBranchStatus(
  projectRoot: string
): Promise<GitRepositoryStatus> {
  const currentBranch = await git.currentBranch({ fs, dir: projectRoot })
  const branches = await git.listBranches({ fs, dir: projectRoot })
  // TODO: history
  const history = await getHistory(projectRoot, { ref: currentBranch })
  return {
    currentBranch,
    branches,
    history
  }
}
